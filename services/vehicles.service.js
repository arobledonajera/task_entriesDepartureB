const _ = require("lodash");
const { vehicles } = require("../repositories/index.repository");
const moment = require("moment");

const taskEntriesDepartures = async () => {
    //Devices Grupo Bimbo
// const devicesId = ["b621","b60A","b609","b60B","bA43","bA45","bA40","bA42",
// "b9B0","bA48","bA4C","bA3F","bA3C","bA3B","bA05","bA4A","bA08","bA4B","bA36","b9B8","bA49","bA09","b9B9","b9B7","bA0B","bA06",
// "bA0A","bA07","bA35","bA47","bA46","bA44","b608"];

//Devices Barcel
const devicesId = ["b1EA","b1FD","b240","b1D1","b221","b1D2","b23B","b21E","b21C","b242","b1D8","b22E","b202","b1D3", "b23A","b223","b20A","b203","b1E3","b1D6","b209","b232","b211","b243","b22B","b1D7","b225",
    "b1E9","b1E0","b1F9","b229","b23F","b1D9","b238","b1FE","b236","b1F1","b1F4","b23C","b20E","b21B","b1E7","b245", "b207","b220","b230","b1DE","b1CF","b222","b1EC","b1DB","b224","b239","b231","b1DD","b21D",
    "b1E8","b1F5","b205","b23D","b20B","b24A","b21A","b23E","b227","b1F0","b1EB","b208","b1E2","b1FA","b1F8","b200", "b22F","b1E5","b22A","b246","b1E6","b218","b248","b214","b1D0","b1F6","b20F","b216","b1F2",
    "b1FC","b233","b226","b206","b22D","b201","b1F7","b212","b1DF","b234","b1E1","b247","b1FF","b20D","b237","b217", "b213","b204","b1DC","b1EE","b1F3","b1E4","b219","b241","b210","b20C","b228","b1EF","b1ED",
    "b215","b244","b1FB","b21F"];

let info = "";
let dateEntrie = "";
let dateDeparture = "";
let identifier = "";
let duration = "";
let subtraction = "";
const today = moment();
let deviceId = "";
const date = today.subtract(1, 'days');
const date_query = date.format('YYYY-MM-DD');

const data = {
    DeviceId: "",
    duration: "",
    date: "",
};
const deviceArray = [];
for (const devices of devicesId) {
    info = await vehicles.getTestSubtraction(devices, date_query);
    let array = info[0].subtraction_by_device_v2;

    if (array.data) {
        for (let res of array.data) {
        if (res.type == "entrie") {
            deviceId = res.DeviceId;
            dateEntrie = moment(res.ActiveFrom);
            identifier = res.identifier;
        } else {
            if (dateEntrie != "" && identifier != "" && res.DeviceId == deviceId) {
            if (res.identifier == identifier) {
                dateDeparture = moment(res.ActiveFrom);
                duration = moment.duration(dateDeparture.diff(dateEntrie));
                subtraction = moment.utc(duration.asMilliseconds()).format('HH:mm:ss.SSS');
                const insert = await vehicles.addDurationEntriesDepartures(res.DeviceId, res.economic, res.vin, res.plate, moment(dateEntrie).format("YYYY-MM-DD HH:mm:ss.SSS"), moment(dateDeparture).format("YYYY-MM-DD HH:mm:ss.SSS"), subtraction, date_query);
                data.DeviceId = res.DeviceId;
                data.duration = subtraction;
                data.date = moment(res.ActiveFrom).format("YYYY-MM-DD");
                const resume = { ...data };
                deviceArray.push(resume);
                (identifier = ""),
                (dateEntrie = ""),
                (dateDeparture = ""),
                (duration = ""),
                (subtraction = "");
            }
            }
        }
        }
    }
    }

    console.log('Tarea terminada');
    return deviceArray;
};
module.exports = {
    taskEntriesDepartures,
};
