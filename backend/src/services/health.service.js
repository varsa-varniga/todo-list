
const getHealthStatus = async() => {

    return {
        uptime:process.uptime(),
        timestamp: Date.now(),
        status: "OK"
    };
};




module.exports = {getHealthStatus}