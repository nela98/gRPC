let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");

let readLine = require("readline");
const { PRIORITY_ABOVE_NORMAL } = require("constants");

let reader = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

let proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("../proto/vacaciones.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

const REMOTE_URL= "0.0.0.0:50050";

client = new proto.work_leave.EmployeeLeaveDaysService(
    REMOTE_URL, grpc.credentials.createInsecure()
);

reader.question("Enter employee id:", answer =>{
    employee_id = answer;
    }, "Enter name:", answer =>{
        name = answer; 
    },"Enter accrued leave days:", answer =>{
        accrued_leave_days = answer;
    },"Enter requested leave days:", answer =>{
        requested_leave_days = answer;
        client.eligibleForLeave(requested_leave_days, accrued_leave_days, (err, res) => {(gran = res.eligible);});
        client.grantLeave(requested_leave_days, accrued_leave_days, (err,res) => {(acc = res.accrued_leave_days, grant = res.granted_leave_days);});
        console.log(`{granted: ${gran}, accrued leave days: ${acc}, granted leave days: ${grant}}`);
});


