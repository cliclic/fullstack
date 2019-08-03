import {Schema} from "mongoose";
import ObjectId = Schema.Types.ObjectId;
import {GameInstance, GameLotModel, GameModel, GameShotModel} from "../../api-service/src/modules/game/GameEntity";
import {isModel} from "./common/helpers";
import ioService from './ioService';
import {GameServiceMessageType} from "./consts";

export class GameRunner {
    static runners = new Map<ObjectId, GameRunner>();
    static loopInterval = 1000;
    static gameLoopInterval = 1000;

    static start() {
        setInterval(async () => {
            const now = new Date();

            try {
                const gamesToRun = await GameModel.find({starAt: {$lte: now}, endAt: {$gt: now}, completed: false});
                gamesToRun.forEach((game) => {
                    if (!this.runners.has(game._id)) {
                        this.runners.set(game._id, new GameRunner(game));
                    }
                });
            } catch (e) {
                console.error (e);
            }
        }, GameRunner.loopInterval);

        ioService.io.onconnection( (socket) => {
            socket.emit(GameServiceMessageType.init, {
                runningGames: Array.from(this.runners.values()).map(runner => runner.game),
                timestamp: Date.now()
            });
        })
    }

    game: GameInstance;
    winningDelay: number;
    loop: NodeJS.Timeout;

    constructor(game) {
        this.game = game;
        this.startLoop();
    }

    async startLoop() {
        if (!this.loop) {
            this.loop = setInterval(this.loopFn.bind(this), GameRunner.gameLoopInterval);
            this.loopFn();
            this.game.started = true;
            try
            {
                await this.game.save();
            } catch (e) {
                console.error(e)
            }
            ioService.sendGameStart(this.game);
        }
    }

    updateCurrentWinningDelay(game: GameInstance = this.game) {
        const nowDate = new Date();
        const now = nowDate.getMinutes() * 60000 + nowDate.getSeconds() * 1000 + nowDate.getMilliseconds();
        const currentTimeSlot = game.timeSlots.find(timeSlot => now >= timeSlot.startTime && now < timeSlot.endTime);
        let newDelay;
        if (currentTimeSlot) {
            newDelay = currentTimeSlot.data.winningDelay;
        } else {
            newDelay = 30000;
        }
        if (newDelay !== this.winningDelay) {
            if (this.winningDelay) ioService.sendGameWinningDelayChange(this.game, newDelay);
            this.winningDelay = newDelay;
        }
    }

    async loopFn() {
        try {
            const game = await GameModel.findById(this.game._id).populate('currentLot').exec();
            if (!game) {
                this.stopLoop();
            } else {
                this.game = game;
            }
        } catch (e) {
            console.warn('Game refresh fail', e);
        }

        if (new Date() >= this.game.endAt) {
            return this.endGame();
        }

        if (!this.game.currentLot) {
            const hasNextLot = await this.startNextLot();
            if (!hasNextLot) {
                return this.endGame();
            } else {
                ioService.sendGameLotChange(this.game);
            }
        }

        this.updateCurrentWinningDelay();

        const now = Date.now();
        try {
            const count = await GameShotModel.count({game: this.game});
            if (count > 0) {
                const lastShot = await GameShotModel.findOne({game: this.game, createdAt: {$gte: now - this.winningDelay}});
                if (!lastShot) {
                    const winnerShot = await GameShotModel.findOne({game: this.game}).sort('createdAt');
                    if (isModel(this.game.currentLot)) {
                        this.game.currentLot.winnerShot = winnerShot;
                        await this.game.currentLot.save();

                        ioService.sendWinner(this.game.currentLot);

                        const hasNextLot = await this.startNextLot();
                        if (!hasNextLot) {
                            return this.endGame();
                        } else {
                            ioService.sendGameLotChange(this.game);
                        }
                    }
                }
            }
        } catch (e) {
            console.error (e);
        }
    }

    stopLoop() {
        if (this.loop) {
            clearInterval(this.loop);
            this.loop = null;
        }
    }

    async endGame() {
        this.stopLoop();
        this.game.completed = true;
        this.game.started = false;
        GameRunner.runners.delete(this.game._id);
        try
        {
            await this.game.save();
        } catch (e) {
            console.error(e);
        }
        ioService.sendGameEnd(this.game);
    }

    async startNextLot() {
        try {
            const nextLot = await GameLotModel.findOne({winner: null}).sort('index').exec();
            if (nextLot) {
                this.game.currentLot = nextLot;
                this.game.save();
            } else {
                return false;
            }
        } catch (e) {
            console.error(e);
            return false;
        }
        return true;
    }
}
