const {getHealthStatus} = require("../services/health.service");


const healthCheck = async (req, res) => {
    try {
      const status = await getHealthStatus();
      res.status(200).json({
         success : true,
         message : "server is healthy",
         data : status
      });
    }
    catch (error) {
        res.status(500).json({
            success : false,
            message : "server error"
        });

    }
};

module.exports = {healthCheck}
 