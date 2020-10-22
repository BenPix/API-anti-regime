const connection = require("../config/db");

class SportDepense {
    static read(callback) {
        connection.query("SELECT * FROM sport_depense", function(error, results) {
            if (error) throw error;
            callback(results);
        })
    }

    static readForExamples(callback) {
        connection.query("SELECT * FROM sport_depense WHERE id IN (2, 8, 19, 25, 39)", function(error, results) {
            if (error) throw error;
            callback(results);
        })
    }
}

module.exports = SportDepense;