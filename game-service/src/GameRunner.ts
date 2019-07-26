import {Schema} from "mongoose";
import ObjectId = Schema.Types.ObjectId;
import {GameInstance, GameLotModel, GameModel, GameShotInstance, GameShotModel} from "../../api-service/src/modules/game/GameEntity";
import {isModel} from "./common/helpers";
import * as SocketIO from "socket.io";

export class GameRunner {
    static runners = new Map<ObjectId, GameRunner>();
    static loopInterval = 1000;
    static gameLoopInterval = 1000;
    static realTimeServer: SocketIO.Server;

    static start(io: SocketIO.Server) {
        this.realTimeServer = io;
        setInterval(async () => {
            const now = new Date();

            try {
                const gamesToRun = await GameModel.find({starAt: {$lte: now}, endAt: {$gt: now}});
                this.runners.forEach((runner, id) => {
                    if (gamesToRun.find(game => runner.game._id === id)) {
                        runner.startLoop();
                        this.runners.delete(id);
                    }
                });
                gamesToRun.forEach((game) => {
                    this.runners.set(game._id, new GameRunner(game))
                });
            } catch (e) {
                console.error (e);
            }
        }, GameRunner.loopInterval);
    }

    game: GameInstance;
    loop: NodeJS.Timeout;

    constructor(game) {
        this.game = game;
    }

    startLoop() {
        if (!this.loop) {
            this.loop = setInterval(this.loopFn.bind(this), GameRunner.gameLoopInterval);
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

        if (!this.game.currentLot) {
            const hasNextLot = await this.startNextLot();
            if (!hasNextLot) {
                return this.endGame();
            }
        }

        const now = Date.now();
        try {
            const count = await GameShotModel.count({game: this.game});
            if (count > 0) {
                const lastShot = await GameShotModel.findOne({game: this.game, createdAt: {$gte: now - this.game.winningDelay}});
                if (!lastShot) {
                    const winnerShot = await GameShotModel.findOne({game: this.game}).sort('createdAt');
                    if (isModel(this.game.currentLot)) {
                        this.game.currentLot.winnerShot = winnerShot;
                        await this.game.currentLot.save();

                        GameRunner.realTimeServer.emit('winner', {
                            lot: this.game.currentLot,
                            timestamp: Date.now()
                        });

                        const hasNextLot = await this.startNextLot();
                        if (!hasNextLot) {
                            return this.endGame();
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
        this.game.completed = true;
        await this.game.save();
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
