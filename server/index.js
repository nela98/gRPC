const grpc = require('grpc');
let protoLoader = require("@grpc/proto-loader");

const server = new grpc.Server();
const URL= "0.0.0.0:50050";

let proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("../proto/vacaciones.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

function eligibleForLeave(call, callback) {
    if (call.request.requested_leave_days > 0) {
        if (call.request.accrued_leave_days > call.request.requested_leave_days) {
            callback(null, { eligible: true });
        } else {
            callback(null, { eligible: false });
        }-1
    } else {
        callback(new Error('Invalid requested days'));
    }
}

function grantLeave(call, callback) {
    let granted_leave_days = call.request.requested_leave_days;
    let accrued_leave_days = call.request.accrued_leave_days - granted_leave_days;
    callback(null, {
        granted: true,
        granted_leave_days,
        accrued_leave_days
    });
}

server.addService(proto.work_leave.EmployeeLeaveDaysService.service,{ eligibleForLeave: eligibleForLeave},{ grantLeave: grantLeave});
server.bind(URL, grpc.ServerCredentials.createInsecure());
server.start();
console.log('grpc server running on port:', URL);