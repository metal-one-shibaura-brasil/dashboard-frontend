/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import { startOfDay, endOfDay, format } from 'date-fns';
import { convertToTimeZone } from 'date-fns-timezone/dist/convertToTimeZone';

import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';
import { formatToTimeZone } from 'date-fns-timezone';

import TagMOSB from '../../assets/brasil.png';
import TagIMOP from '../../assets/india.png';

interface DealsMachineInterface {
  status: string;
  statusString: string;
  from: number;
  dayfrom: Date;
  to: number;
  dayto: Date;
  marginLeftDiv: number;
  widthDiv: number;
  id: string;
}

interface SeriesTableInterface {
  name: string;
  factory: string;
  operating?: number;
  connected?: number;
  deals: DealsMachineInterface[] | null;
  sequenceMachine?: number;
}

interface DataMachineInterface {
  id: string;
  factory: string;
  machine: string;
  datatime: Date;
  status: string;
}

interface NewTitleDateInterface {
  title: string;
  dayTitle: Date;
  widthTitleDiv: number;
}

interface MachineInterface {
  id: string;
  name: string;
  description: string;
  group: string;
  factory: string;
  sequenceMachine?: string;
}

interface PropsPage {
  dataMachine: DataMachineInterface[] | null;
  dateMachine: string | undefined;
  allMachines: MachineInterface[];
  dateTimeMachine: number;
}

interface DateTimeFactoriesInterface {
  factory: string;
  dateTime?: number;
  marginLeftDiv?: number;
  dateTimeString?: string;
  myTimeZone?: string;
  hourGMTzero?: Date;
}

const useStyles = makeStyles(theme => ({
  graphicDiv: {
    backgroundColor: theme.palette.background.default,
  },
  graphicDivConnected: {
    float: 'left',
    width: '80px',
    padding: 1,
    /* color: '#fff',
    backgroundColor: '#f44336', */
  },
  graphicDivOperating: {
    marginLeft: '10px',
    float: 'left',
    width: '80px',
    padding: 1,
    color: '#fff',
    backgroundColor: '#4caf50',
  },
}));

const GraphicDashboard: React.FC<PropsPage> = props => {
  const classes = useStyles();
  const timeZone = 'GMT';
  const timeZoneIMOP = 'Asia/Kolkata';
  const timeZoneMOSB = 'America/Sao_Paulo';
  const MyTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const newDate = convertToTimeZone(
    props.dateMachine ? new Date(props.dateMachine) : new Date(),
    { timeZone },
  );
  const getTimeStart = startOfDay(newDate).getTime();
  const getTimeEnd = endOfDay(newDate).getTime();
  const getTimeDiff = ((getTimeEnd - getTimeStart) / 72000).toFixed(0);
  const [SeriesTable, setSeriesTable] = useState<SeriesTableInterface[] | null>(
    null,
  );
  const [TitleDate, setTitleDate] = useState<NewTitleDateInterface[] | null>(
    null,
  );
  const [DateTimeFactories, setDateTimeFactories] = useState<
    DateTimeFactoriesInterface[] | null
  >(null);

  useEffect(() => {
    let newSeriesTable: SeriesTableInterface[] | undefined;
    let newTitleDate: NewTitleDateInterface[] | undefined;
    let newFactories: DateTimeFactoriesInterface[] | undefined;
    for (let i = getTimeStart; i <= getTimeEnd; i += 3600000) {
      if (newTitleDate) {
        newTitleDate.push({
          title: format(new Date(i), 'HH:mm'),
          dayTitle: new Date(i),
          widthTitleDiv: 50,
        });
      } else {
        newTitleDate = [
          {
            title: format(new Date(i), 'HH:mm'),
            dayTitle: new Date(i),
            widthTitleDiv: 50,
          },
        ];
      }
    }
    if (newTitleDate && newTitleDate?.length > 0) {
      setTitleDate(newTitleDate);
    }
    // console.log(new Date(getTimeStart));
    // console.log(getTimeStart);
    // console.log(newTitleDate);
    if (props.dataMachine && props.allMachines) {
      // let machines: MachinesInterface[] | undefined;
      // eslint-disable-next-line react/prop-types
      props.allMachines.map(eachMachine => {
        let operating = 0;
        let connected = 0;
        let statusObject: DealsMachineInterface[] | undefined;
        let statusLast = '';
        let statusString = '';
        let statusLastString = '';
        let statusLastTime = getTimeStart;
        let statusLastGetTime = getTimeStart;
        let marginLeftDivLast = 0;

        if (newFactories) {
          const factoriesexisting = newFactories.filter(
            eachFactory => eachFactory.factory === eachMachine.factory,
          );
          if (factoriesexisting.length === 0)
            newFactories.push({ factory: eachMachine.factory });
        } else {
          newFactories = [{ factory: eachMachine.factory }];
        }

        if (props.dataMachine) {
          // eslint-disable-next-line react/prop-types
          props.dataMachine
            // eslint-disable-next-line react/prop-types
            .filter(
              (dataMachine: DataMachineInterface) =>
                dataMachine.machine === eachMachine.description,
            )
            // eslint-disable-next-line react/prop-types
            .sort(
              (
                dataMachine1: DataMachineInterface,
                dataMachine2: DataMachineInterface,
              ) => (dataMachine1.datatime > dataMachine2.datatime ? 1 : -1),
            )
            // eslint-disable-next-line no-loop-func
            .map((dataMachine: DataMachineInterface) => {
              const dateConverTimeZone = convertToTimeZone(
                new Date(dataMachine.datatime),
                {
                  timeZone,
                },
              );

              if (dataMachine.status && dataMachine.status === '0190') {
                operating += 2;
                connected += 2;
                statusString = 'Operating';
              }

              if (dataMachine.status && dataMachine.status === '0290') {
                operating += 2;
                connected += 2;
                statusString = 'Operating';
              }

              if (dataMachine.status && dataMachine.status === '0390') {
                operating += 2;
                connected += 2;
                statusString = 'Operating';
              }

              if (
                dataMachine.status &&
                (dataMachine.status === '0101' ||
                  dataMachine.status === '0102' ||
                  dataMachine.status === '0103' ||
                  dataMachine.status === '0180' ||
                  dataMachine.status === '0181' ||
                  dataMachine.status === '0182' ||
                  dataMachine.status === '0183' ||
                  dataMachine.status === '0380' ||
                  dataMachine.status === '0382' ||
                  dataMachine.status === '0383' ||
                  dataMachine.status === '0500' ||
                  dataMachine.status === '0580' ||
                  dataMachine.status === '8188' ||
                  dataMachine.status === '8588')
              ) {
                operating += 2;
                connected += 2;
                statusString = 'Operating';
              }

              if (dataMachine.status && dataMachine.status === '0100') {
                connected += 2;
                statusString = 'Not Operating';
              }

              if (statusLast && statusLast !== `status${dataMachine.status}`) {
                if (statusObject) {
                  statusObject.push({
                    status: statusLast,
                    statusString: statusLastString,
                    from: statusLastGetTime,
                    dayfrom: new Date(statusLastGetTime),
                    to: dateConverTimeZone.getTime(),
                    dayto: dateConverTimeZone,
                    marginLeftDiv: marginLeftDivLast,
                    widthDiv:
                      (dateConverTimeZone.getTime() - statusLastGetTime) /
                      72000,
                    id: dataMachine.id,
                  });
                } else {
                  statusObject = [
                    {
                      status: statusLast,
                      statusString: statusLastString,
                      from: statusLastGetTime,
                      dayfrom: new Date(statusLastGetTime),
                      to: dateConverTimeZone.getTime(),
                      dayto: dateConverTimeZone,
                      marginLeftDiv: marginLeftDivLast,
                      widthDiv:
                        (dateConverTimeZone.getTime() - statusLastGetTime) /
                        72000,
                      id: dataMachine.id,
                    },
                  ];
                }
                statusLast = `status${dataMachine.status}`;
                statusLastString = statusString;
                statusLastGetTime = dateConverTimeZone.getTime();
                marginLeftDivLast = 0;
              } else if (!statusLast) {
                statusLast = `status${dataMachine.status}`;
                statusLastGetTime = dateConverTimeZone.getTime();
                statusLastString = statusString;
                marginLeftDivLast =
                  (dateConverTimeZone.getTime() - getTimeStart) / 72000;
              }

              statusLastTime = dateConverTimeZone.getTime();

              return true;
            });
        }
        const getTimeNow = () => {
          if (eachMachine.factory === 'MOSB') {
            return statusLastTime > getTimeEnd
              ? new Date(getTimeEnd)
              : new Date(statusLastTime);
          }
          return statusLastTime > getTimeEnd
            ? new Date(getTimeEnd)
            : new Date(statusLastTime);
        };

        if (statusObject) {
          statusObject.push({
            status: statusLast,
            statusString: statusLastString,
            from: statusLastGetTime,
            dayfrom: new Date(statusLastGetTime),
            to: getTimeNow().getTime(),
            dayto: getTimeNow(),
            marginLeftDiv: marginLeftDivLast,
            widthDiv: (getTimeNow().getTime() - statusLastGetTime) / 72000,
            id: '',
          });
        } else {
          statusObject = [
            {
              status: statusLast,
              statusString: statusLastString,
              from: statusLastGetTime,
              dayfrom: new Date(statusLastGetTime),
              to: getTimeNow().getTime(),
              dayto: getTimeNow(),
              marginLeftDiv: marginLeftDivLast,
              widthDiv: (getTimeNow().getTime() - statusLastGetTime) / 72000,
              id: '',
            },
          ];
        }

        if (newSeriesTable) {
          newSeriesTable.push({
            name: eachMachine.description,
            factory: eachMachine.factory,
            sequenceMachine: parseFloat(
              eachMachine.sequenceMachine ? eachMachine.sequenceMachine : '0',
            ),
            operating,
            connected,
            deals: statusObject || null,
          });
        } else {
          newSeriesTable = [
            {
              name: eachMachine.description,
              factory: eachMachine.factory,
              sequenceMachine: parseFloat(
                eachMachine.sequenceMachine ? eachMachine.sequenceMachine : '0',
              ),
              operating,
              connected,
              deals: statusObject || null,
            },
          ];
        }

        return true;
      });

      if (newSeriesTable) {
        setSeriesTable(newSeriesTable);
      }

      if (newFactories) {
        setDateTimeFactories(newFactories);
      }
    }
  }, [getTimeEnd, getTimeStart, props.allMachines, props.dataMachine]);

  useEffect(() => {
    if (DateTimeFactories) {
      const TimeMilessegundos = convertToTimeZone(props.dateTimeMachine, {
        timeZone,
      });
      setDateTimeFactories(
        DateTimeFactories.map(
          (eachDateTimeFactory: DateTimeFactoriesInterface) => {
            if (MyTimezone === 'America/Sao_Paulo') {
              if (eachDateTimeFactory.factory === 'MOSB') {
                return {
                  ...eachDateTimeFactory,
                  dateTime: props.dateTimeMachine,
                  marginLeftDiv:
                    props.dateTimeMachine > getTimeStart
                      ? (props.dateTimeMachine - getTimeStart) / 72000
                      : -1200,
                  dateTimeString: format(props.dateTimeMachine, 'HH:mm:ss'),
                  myTimeZone: MyTimezone,
                  hourGMTzero: TimeMilessegundos,
                };
              }
              if (eachDateTimeFactory.factory === 'IMOP') {
                const TimeMilessegundosIMOP = convertToTimeZone(
                  props.dateTimeMachine,
                  {
                    timeZone: timeZoneIMOP,
                  },
                );
                return {
                  ...eachDateTimeFactory,
                  dateTime: TimeMilessegundosIMOP.getTime(),
                  marginLeftDiv:
                    (TimeMilessegundosIMOP.getTime() - getTimeStart) / 72000,
                  dateTimeString: formatToTimeZone(
                    props.dateTimeMachine,
                    'HH:mm:ss',
                    { timeZone: timeZoneIMOP },
                  ),
                  myTimeZone: `${MyTimezone} 1`,
                  hourGMTzero: TimeMilessegundos,
                };
              }
              return {
                ...eachDateTimeFactory,
                dateTime: 0,
                marginLeftDiv: 0,
                dateTimeString: '',
              };
            }
            if (MyTimezone === 'Asia/Kolkata') {
              if (eachDateTimeFactory.factory === 'MOSB') {
                const TimeMilessegundosMOSB = convertToTimeZone(
                  TimeMilessegundos,
                  {
                    timeZone: timeZoneMOSB,
                  },
                );

                return {
                  ...eachDateTimeFactory,
                  dateTime: TimeMilessegundosMOSB.getTime(),
                  marginLeftDiv:
                    (TimeMilessegundosMOSB.getTime() - getTimeStart) / 72000,
                  dateTimeString: format(props.dateTimeMachine, 'HH:mm:ss'),
                  myTimeZone: MyTimezone,
                  hourGMTzero: TimeMilessegundos,
                };
              }
              if (eachDateTimeFactory.factory === 'IMOP') {
                return {
                  ...eachDateTimeFactory,
                  dateTime: props.dateTimeMachine,
                  marginLeftDiv:
                    props.dateTimeMachine > getTimeStart
                      ? (props.dateTimeMachine - getTimeStart) / 72000
                      : -1200,
                  dateTimeString: format(props.dateTimeMachine, 'HH:mm:ss'),
                  myTimeZone: MyTimezone,
                  hourGMTzero: TimeMilessegundos,
                };
              }
            }

            if (eachDateTimeFactory.factory === 'MOSB') {
              const TimeMilessegundosMOSB = convertToTimeZone(
                TimeMilessegundos,
                {
                  timeZone: timeZoneMOSB,
                },
              );

              return {
                ...eachDateTimeFactory,
                dateTime: TimeMilessegundosMOSB.getTime(),
                marginLeftDiv:
                  (TimeMilessegundosMOSB.getTime() - getTimeStart) / 72000,
                dateTimeString: format(props.dateTimeMachine, 'HH:mm:ss'),
                myTimeZone: MyTimezone,
                hourGMTzero: TimeMilessegundos,
              };
            }
            if (eachDateTimeFactory.factory === 'IMOP') {
              const TimeMilessegundosIMOP = convertToTimeZone(
                TimeMilessegundos,
                {
                  timeZone: timeZoneIMOP,
                },
              );

              return {
                ...eachDateTimeFactory,
                dateTime: TimeMilessegundosIMOP.getTime(),
                marginLeftDiv:
                  (TimeMilessegundosIMOP.getTime() - getTimeStart) / 72000,
                dateTimeString: format(props.dateTimeMachine, 'HH:mm:ss'),
                myTimeZone: MyTimezone,
                hourGMTzero: TimeMilessegundos,
              };
            }
            return {
              ...eachDateTimeFactory,
              dateTime: 0,
              marginLeftDiv: 0,
              dateTimeString: '',
              myTimeZone: MyTimezone,
              hourGMTzero: TimeMilessegundos,
            };
          },
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dateTimeMachine]);

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <div style={{ width: '180px' }}>Machine</div>
            </TableCell>
            <TableCell>
              <div style={{ width: '170px' }}>Connected / Operating</div>
            </TableCell>
            <TableCell>
              <div style={{ width: '70px' }}>Efficiency</div>
            </TableCell>
            <TableCell style={{ display: 'none' }}>My Timezone</TableCell>
            <TableCell>
              <div
                style={{
                  width: `${getTimeDiff}px`,
                  float: 'left',
                  position: 'fixed',
                }}
              >
                {DateTimeFactories?.map(eachDateTimeFactory => {
                  return (
                    <div
                      style={{
                        position: 'absolute',
                        color: 'black',
                        height: `${
                          SeriesTable ? (SeriesTable.length + 2) * 34 : 0
                        }px`,
                        marginLeft: `${eachDateTimeFactory.marginLeftDiv}px`,
                        display: 'flex',
                        alignItems: 'flex-end',
                        borderLeft: '1px solid rgba(0, 0, 0, 0.38)',
                        opacity: '0.3',
                        padding: '0px 10px',
                      }}
                    >
                      <Tooltip
                        // eslint-disable-next-line prettier/prettier
                        title={(
                          <Typography>
                            <p>{`My Timezone: ${eachDateTimeFactory.myTimeZone}`}</p>
                            <p>{`Hour GMT Zero: ${eachDateTimeFactory.hourGMTzero}`}</p>
                          </Typography>
                          // eslint-disable-next-line prettier/prettier
                        )}
                      >
                        <Typography>{`${eachDateTimeFactory.factory} - ${eachDateTimeFactory.dateTimeString}`}</Typography>
                      </Tooltip>
                    </div>
                  );
                })}
              </div>
              <div style={{ width: `${getTimeDiff}px`, float: 'left' }}>
                {TitleDate?.map((eachTitle: NewTitleDateInterface) => {
                  return (
                    <>
                      <div
                        style={{
                          width: eachTitle.widthTitleDiv,
                          float: 'left',
                        }}
                      >
                        {eachTitle.title}
                      </div>
                    </>
                  );
                })}
              </div>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {SeriesTable &&
            SeriesTable.sort((eachSeries, eachSeries2) => {
              if (eachSeries.sequenceMachine && eachSeries2.sequenceMachine) {
                return eachSeries.sequenceMachine > eachSeries2.sequenceMachine
                  ? 1
                  : -1;
              }
              return 0;
            }).map((eachSeries: SeriesTableInterface, index: number) => (
              <TableRow
                key={index.toString()}
                style={{ padding: '0px !important' }}
              >
                <TableCell>
                  <img
                    src={eachSeries.factory === 'IMOP' ? TagIMOP : TagMOSB}
                    alt={eachSeries.factory}
                    height="17"
                  />
                  {` ${eachSeries.factory} - ${eachSeries.name}`}
                </TableCell>
                <TableCell>
                  <div className={classes.graphicDivConnected}>
                    {`${eachSeries.connected} min`}
                  </div>
                  <div className={classes.graphicDivOperating}>
                    {`${eachSeries.operating}  min`}
                  </div>
                </TableCell>
                <TableCell>
                  {eachSeries.connected &&
                  eachSeries.connected > 0 &&
                  eachSeries.operating &&
                  eachSeries.operating > 0
                    ? `${(
                        (parseFloat(eachSeries.operating.toString()) /
                          parseFloat(eachSeries.connected.toString())) *
                        100
                      ).toFixed(2)} %`
                    : '-'}
                </TableCell>
                <TableCell style={{ display: 'none' }}>{MyTimezone}</TableCell>
                <TableCell>
                  <div
                    className={classes.graphicDiv}
                    style={{ width: `${getTimeDiff}px`, float: 'left' }}
                  >
                    {eachSeries.deals
                      ? eachSeries.deals.map(
                          (eachDeal: DealsMachineInterface) => {
                            return (
                              <Tooltip
                                // eslint-disable-next-line prettier/prettier
                                title={(
                                  <>
                                    <Typography>{`${eachSeries.factory} ${eachSeries.name} - ${eachDeal.statusString}`}</Typography>
                                    <Typography>
                                      {format(
                                        new Date(eachDeal.from),
                                        'MMMM dd, yyyy',
                                      )}
                                      {` ( ${format(
                                        new Date(eachDeal.from),
                                        ' HH:mm',
                                      )} - ${format(
                                        new Date(eachDeal.to),
                                        ' HH:mm',
                                      )} )`}
                                    </Typography>
                                  </>
                                  // eslint-disable-next-line prettier/prettier
                                )}
                              >
                                <div
                                  className={eachDeal.status}
                                  style={{
                                    marginLeft: eachDeal.marginLeftDiv,
                                    width: eachDeal.widthDiv,
                                    float: 'left',
                                  }}
                                >
                                  <span style={{ display: 'none' }}>
                                    {`${eachDeal.status} - ${eachDeal.marginLeftDiv}`}
                                  </span>
                                  .
                                </div>
                              </Tooltip>
                            );
                          },
                        )
                      : '- '}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          {/* {timeZones.map(eachTimezone => (
            <TableRow>
              <TableCell colSpan={7}>{eachTimezone}</TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GraphicDashboard;
