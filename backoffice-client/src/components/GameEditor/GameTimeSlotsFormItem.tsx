import "./GameTimeSlotsFormItem.scss";
import React, {FormEvent, FocusEvent, FunctionComponent, useState, Fragment} from "react";
import {Button, Radio, Form, Icon, Input, DatePicker, Table, TimePicker} from "antd";
import {FormComponentProps, ValidateCallback, ValidationRule} from "antd/es/form";
import {CreateGameInput} from "../common/apolloQueries";
import {GameTimeSlot} from "../common/consts";
import "moment-duration-format";
import moment, {DurationFormatSettings, Moment} from "moment";
import Column from "antd/lib/table/Column";
import {func} from "prop-types";
import {cloneDeep} from "lodash";

const rangeSize = 86400000;

export interface CreateGameFormControls {
    submit?: () => void;
}

type ScaleGrid = ScaleSlot[];

export interface ScaleSlot {
    label: string,
    style: {
        width: string
    }
}

interface GameTimeSlotsFormItemProps extends FormComponentProps {
    formItemLayout: any
}

function createScaleGrid(unitSize: number, rangeSize: number, unitLabelFormat: string, unitLabelFormatOptions?: DurationFormatSettings) {
    const scaleGrid: ScaleGrid = [];
    for (let i = 0; i <= rangeSize; i += unitSize) {
        scaleGrid.push({
            label: moment.duration(i).format(unitLabelFormat),
            style: {
                width: (100 * unitSize / rangeSize ) + '%'
            }
        });
    }
    return scaleGrid;
}

const scaleGrid = createScaleGrid(7200000, rangeSize, 'h[h]');

function renderTimeCell (value: number) {
    return moment.duration(value).format('hh[h]mm', {trim: false});
}

function renderWinningDelayCell (value: number) {
    return moment.duration(value).format('mm[m]ss[s]');
}

export const GameTimeSlotsFormItem: FunctionComponent<GameTimeSlotsFormItemProps> = function (props) {
    const {formItemLayout, form} = props;
    const {getFieldDecorator} = form;

    const [startTime, setStartTime] = useState<Moment>();
    const [endTime, setEndTime] = useState<Moment>();
    const [winningDelay, setWinningDelay] = useState(30000);

    const [timeSlots, setTimeSlots] = useState<GameTimeSlot[]>([{
        startTime: 0,
        endTime: rangeSize,
        data: {
            winningDelay: 30000
        }
    }]);

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
            let newTimeSlots = timeSlots.slice();
            let insertAt = 0;

            const startTimeValue = startTime.startOf('minute').valueOf() - moment(startTime).startOf('date').valueOf();
            const endTimeValue = endTime.startOf('minute').valueOf() - moment(endTime).startOf('date').valueOf();

            for (let i = timeSlots.length - 1; i >= 0; i--) {
                if (timeSlots[i].startTime < startTimeValue) {
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

            for (let i = 0; i<newTimeSlots.length - 1; i++) {
                const timeSlot = newTimeSlots[i];
                const nextTimeSlot = newTimeSlots[i + 1];
                if (timeSlot.data.winningDelay === nextTimeSlot.data.winningDelay) {
                    timeSlot.endTime = nextTimeSlot.endTime;
                    newTimeSlots.splice(i + 1, 1);
                    i--;
                }
            }

            setStartTime(undefined);
            setEndTime(undefined);
            setTimeSlots(newTimeSlots)
        }
    }

    function startTimeDisabledMinutes(selectedHour: number) {
        const minutes = [];
        if (endTime) {
            if (endTime.hour() === selectedHour) {
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
            if (startTime.hour() === selectedHour) {
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

    return (<Form.Item
                className="timeSlotsFormItem"
                label="Compteurs"
                {...formItemLayout}
            >
                <Table size="small" pagination={false} dataSource={timeSlots} bordered={true} rowKey="startTime">
                    <Column title="De" dataIndex="startTime" render={renderTimeCell}/>
                    <Column title="À" dataIndex="endTime" render={renderTimeCell}/>
                    <Column title="Décompte à" dataIndex="data.winningDelay" render={renderWinningDelayCell}/>
                </Table>
                <span className="ant-form-text">
                    De <TimePicker size="small" disabledHours={startTimeDisabledHours} disabledMinutes={startTimeDisabledMinutes} format="HH:mm" value={startTime} onChange={onStartTimeChange} placeholder="hh:mm" /> à <TimePicker size="small" disabledMinutes={endTimeDisabledMinutes} disabledHours={endTimeDisabledHours} format="HH:mm" value={endTime} onChange={onEndTimeChange} placeholder="hh:mm" />&nbsp;<TimePicker size="small" format="mm:ss" value={moment(winningDelay)} onChange={onWinningDelayChange} placeholder="mm:ss" allowClear={false} />&nbsp;<Button type="primary" disabled={!startTime || !endTime} shape="circle" size="small" icon="plus" onClick={addTimeSlot}/>
                 </span>
            </Form.Item>
    )
}
