exports.sendJSONObj = function(res,status,out) {
    console.log("STATUS: "+status);

    res.writeHead(status, { "Content-Type" : "application/json" });
    console.log(JSON.stringify(out));
    res.write(JSON.stringify(out));
    res.end();

}

