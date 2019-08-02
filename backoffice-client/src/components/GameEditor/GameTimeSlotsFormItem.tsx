import "./GameTimeSlotsFormItem.scss";
import React, {FunctionComponent, useState, useEffect} from "react";
import {Button, Form, Table, TimePicker} from "antd";
import {FormComponentProps} from "antd/es/form";
import {GameTimeSlot} from "../common/consts";
import "moment-duration-format";
import moment, {Moment} from "moment";
import Column from "antd/lib/table/Column";
import {cloneDeep} from "lodash";

interface GameTimeSlotsFormItemProps extends FormComponentProps {
    formItemLayout: any;
    onChange?(slots: GameTimeSlot[]): void;
    value: GameTimeSlot[];
    rangeSize: number;
}

function renderTimeCell (value: number) {
    return moment.duration(value).format('hh[h]mm', {trim: false});
}

function consolidateTimeSlots(timeSlots: GameTimeSlot[]) {
    for (let i = 0; i<timeSlots.length - 1; i++) {
        const timeSlot = timeSlots[i];
        const nextTimeSlot = timeSlots[i + 1];
        if (timeSlot.data.winningDelay === nextTimeSlot.data.winningDelay) {
            timeSlot.endTime = nextTimeSlot.endTime;
            timeSlots.splice(i + 1, 1);
            i--;
        }
    }
    return timeSlots;
}

export const GameTimeSlotsFormItem: FunctionComponent<GameTimeSlotsFormItemProps> = function (props) {
    const {rangeSize, formItemLayout, value, onChange} = props;
    const [startTime, setStartTime] = useState<Moment>();
    const [endTime, setEndTime] = useState<Moment>();
    const [winningDelay, setWinningDelay] = useState(30000);

    useEffect(() => {
        if (props.onChange) props.onChange(value)
    }, [value]);

    function triggerOnChange(value: GameTimeSlot[]) {
        if (onChange) onChange(value);
    }

    function onStartTimeChange(time: Moment) {
        if (endTime && startTime && endTime < time) {
            setEndTime(moment(time).add(1,'minute'))
        }
        setStartTime(time);
    }

    function onEndTimeChange(time: Moment) {
        if (endTime && startTime && startTime > time) {
            setStartTime(moment(time).subtract(1,'minute'))
        }
        setEndTime(time);
    }

    function onWinningDelayChange(time: Moment) {
        setWinningDelay(time ? time.startOf('second').valueOf() : 30000);
    }

    function addTimeSlot() {
        if (startTime && endTime) {
            let newTimeSlots = value.slice();
            let insertAt = 0;

            const startTimeValue = startTime.startOf('minute').valueOf() - moment(startTime).startOf('date').valueOf();
            const endTimeValue = endTime.startOf('minute').valueOf() - moment(endTime).startOf('date').valueOf();

            for (let i = value.length - 1; i >= 0; i--) {
                if (value[i].startTime < startTimeValue) {
                    insertAt = i + 1;
                    break;
                }
            }

            newTimeSlots.splice(insertAt, 0, {
                startTime: startTimeValue,
                endTime: endTimeValue,
                data: {
                    winningDelay
                }
            });

            const previousTimeSlot = newTimeSlots[insertAt - 1];
            const insertedTimeSlot = newTimeSlots[insertAt];

            if (previousTimeSlot) {
                if (previousTimeSlot.endTime > insertedTimeSlot.startTime) {
                    if (previousTimeSlot.endTime <= insertedTimeSlot.endTime) {
                        previousTimeSlot.endTime = insertedTimeSlot.startTime;
                    } else {
                        newTimeSlots.splice(insertAt + 1, 0, {
                            startTime: insertedTimeSlot.endTime,
                            endTime: previousTimeSlot.endTime,
                            data: cloneDeep(previousTimeSlot.data)
                        });
                        previousTimeSlot.endTime = insertedTimeSlot.startTime;
                    }
                }
            }

            let nextTimeSlot: GameTimeSlot;
            while ((nextTimeSlot = newTimeSlots[insertAt + 1])) {
                if (nextTimeSlot.startTime > insertedTimeSlot.endTime && nextTimeSlot.endTime <= insertedTimeSlot.endTime) {
                    newTimeSlots.splice(insertAt + 1, 1);
                } else {
                    break;
                }
            }

            if (nextTimeSlot) {
                nextTimeSlot.startTime = insertedTimeSlot.endTime;
            } else if (insertedTimeSlot.endTime < rangeSize) {
                insertedTimeSlot.endTime = rangeSize;
            }

            consolidateTimeSlots(newTimeSlots);

            setStartTime(undefined);
            setEndTime(undefined);
            triggerOnChange(newTimeSlots)
        }
    }

    function removeTimeSlot(timeSlot: GameTimeSlot) {
        let newTimeSlots = value.slice();
        const removeAt = value.findIndex(slot => slot.startTime === timeSlot.startTime);
        if (removeAt > -1) {
            const previousTimeSlot = newTimeSlots[removeAt - 1];
            const nextTimeSlot = newTimeSlots[removeAt + 1];
            if (previousTimeSlot) {
                if (nextTimeSlot) {
                    nextTimeSlot.startTime = previousTimeSlot.endTime;
                } else {
                    previousTimeSlot.endTime = rangeSize;
                }
            } else {
                if (nextTimeSlot) {
                    nextTimeSlot.startTime = 0;
                } else {
                    return;
                }
            }
            newTimeSlots.splice(removeAt, 1);
            consolidateTimeSlots(newTimeSlots);
            triggerOnChange(newTimeSlots)
        }
    }

    function startTimeDisabledMinutes(selectedHour: number) {
        const minutes = [];
        if (endTime) {
            if (!selectedHour || endTime.hour() === selectedHour) {
                for (let i = endTime.minute(); i < 60; i++) {
                    minutes.push(i);
                }
            }
        }
        return minutes;
    }

    function startTimeDisabledHours() {
        const hours = [];
        if (endTime) {
            for (let i = endTime.hour()+1; i < 24; i++) {
                hours.push(i);
            }
        }
        return hours;
    }

    function endTimeDisabledMinutes(selectedHour: number) {
        const minutes = [];
        if (startTime) {
            if (startTime.hour() >= selectedHour) {
                for (let i = 0; i < startTime.minute() + 1; i++) {
                    minutes.push(i);
                }
            }
        }
        return minutes;
    }

    function endTimeDisabledHours() {
        const hours = [0];
        if (startTime) {
            for (let i = 1; i < startTime.hour(); i++) {
                hours.push(i);
            }
        }
        return hours;
    }

    function onWinningDelayEditChange(delay: Moment, timeSlot: GameTimeSlot) {
        const idx = value.indexOf(timeSlot);
        if (idx > -1) {
            const newTimeSlots = cloneDeep(value);
            newTimeSlots[idx].data.winningDelay = delay.startOf('second').valueOf();
            consolidateTimeSlots(newTimeSlots);
            triggerOnChange(newTimeSlots);
        }
    }

    function renderWinningDelayCell (delay: number, timeSlot: GameTimeSlot) {
        return <div className="winningDelayCell">
            <div className="winningDelayText">
                <TimePicker value={moment(delay)} size="small" format="mm:ss" onChange={(value) => onWinningDelayEditChange(value, timeSlot)} allowClear={false} />
            </div>
            {value.length > 1 && <div className="actionButtons">
                <Button type="link" icon="close" onClick={() => removeTimeSlot(timeSlot)}/>
            </div>}
        </div>
    }

    return (<Form.Item
                className="timeSlotsFormItem"
                label="Compteurs"
                {...formItemLayout}
            >
                <Table size="small" pagination={false} dataSource={value} bordered={true} rowKey="startTime">
                    <Column title="De" dataIndex="startTime" render={renderTimeCell}/>
                    <Column title="À" dataIndex="endTime" render={renderTimeCell}/>
                    <Column title="Décompte à" dataIndex="data.winningDelay" render={renderWinningDelayCell}/>
                </Table>
                <span className="ant-form-text addTimeSlotContainer">
                    De <TimePicker size="small" disabledHours={startTimeDisabledHours} disabledMinutes={startTimeDisabledMinutes} format="HH:mm" value={startTime} onChange={onStartTimeChange} placeholder="hh:mm" />&nbsp;
                    à <TimePicker size="small" disabledMinutes={endTimeDisabledMinutes} disabledHours={endTimeDisabledHours} format="HH:mm" value={endTime} onChange={onEndTimeChange} placeholder="hh:mm" />&nbsp;
                    <TimePicker size="small" format="mm:ss" value={moment(winningDelay)} onChange={onWinningDelayChange} placeholder="mm:ss" allowClear={false} />&nbsp;
                    <Button type="primary" disabled={!startTime || !endTime} shape="circle" size="small" icon="plus" onClick={addTimeSlot}/>
                 </span>
            </Form.Item>
    )
}
