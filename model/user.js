const connection = require("../config/db");

class User {
  constructor(row) {
    this.row = row;
  }

  static create(user, callback) {
    if (
      !user.email ||
      !user.password ||
      !user.prenom ||
      !user.naissance ||
      !user.sexe ||
      !user.taille ||
      !user.poids ||
      !user.activitePhysiqueBase ||
      !user.activiteFaible ||
      !user.activiteMoyenne ||
      !user.activiteForte
    ) {
      const error = new Error("Bad request");
      error.status = 400;
      throw error;
    }

    connection.query(
      "INSERT INTO user SET email = ?, password = ?, prenom = ?, naissance = ?, sexe = ?, taille = ?, poids = ?, act_phys_base = ?, act_phys_faible = ?, act_phys_moy = ?, act_phys_forte = ?",
      [
        user.email,
        user.password,
        user.prenom,
        user.naissance,
        user.sexe,
        user.taille,
        user.poids,
        user.activitePhysiqueBase,
        user.activiteFaible,
        user.activiteMoyenne,
        user.activiteForte,
      ],
      function (error, result) {
        if (error) throw error;

        callback(result);
      }
    );
  }

  static find(id, callback) {
    if (!id) {
      const error = new Error("Bad request");
      error.status = 400;
      throw error;
    }

    connection.query(
      "SELECT id, email, prenom, DATE_FORMAT(naissance, '%Y-%m-%d') as naissance, sexe, taille, user.poids, act_phys_base, act_phys_faible, act_phys_moy, act_phys_forte, IFNULL(goal.poids, 0) AS goal_weight, IFNULL(deficit, 0) AS deficit FROM user LEFT JOIN goal ON user.id = goal.user_id WHERE id = ?",
      [id], function (
      error,
      results
    ) {
      if (error) throw error;

      callback((results[0]));
    });
  }

  static exists(email, callback) {
    if (!email) {
      const error = new Error("Bad request");
      error.status = 400;
      throw error;
    }

    connection.query("SELECT * FROM user WHERE email = ?", [email], function (
      error,
      results
    ) {
      if (error) throw error;

      callback(new User(results[0]));
    });
  }

  static connect(email, password, callback) {
    if (!email || !password) {
      const error = new Error("Bad request");
      error.status = 400;
      throw error;
    }

    connection.query(
      "SELECT * FROM user WHERE email = ? AND password = ?",
      [email, password],
      function (error, results) {
        if (error) throw error;

        const success = results.length === 1;
        const user_id = success ? results[0].id : null;
        callback({ success, user_id });
      }
    );
  }

  static weight(poids, date, user_id, callback) {
    if (!poids || !date || !user_id) {
      const error = new Error("Bad request");
      error.status = 400;
      throw error;
    }

    connection.query(
      "INSERT INTO pesee SET user_id = ?, poids = ?, date = ?",
      [user_id, poids, date],
      function (error, result) {
        if (error) throw error;
        callback(result);
      }
    );
  }

  static deleteWeigh(weigh_id, callback) {
    if (!weigh_id) {
      const error = new Error("Bad request");
      error.status = 400;
      throw error;
    }

    connection.query("DELETE FROM pesee WHERE id = ?", [weigh_id], function (
      error,
      result
    ) {
      if (error) throw error;
      callback(result);
    });
  }

  static findWeighings(user_id, callback) {
    if (!user_id) {
      const error = new Error("Bad request");
      error.status = 400;
      throw error;
    }

    var query = connection.query(
      "SELECT id, poids, DATE_FORMAT(date, '%d/%m/%Y') as date FROM pesee WHERE user_id = ? ORDER BY pesee.date DESC",
      [user_id],
      function (error, results) {
        if (error) throw error;
        callback(results);
        console.log(query.sql);
      }
    );
  }

  static findWeighingsForGraph(user_id, callback) {
    if (!user_id) {
      const error = new Error("Bad request");
      error.status = 400;
      throw error;
    }

    var query = connection.query(
      "SELECT poids, date FROM pesee WHERE user_id = ? ORDER BY date ASC",
      [user_id],
      function (error, results) {
        if (error) throw error;
        callback(results);
        console.log(query.sql);
      }
    );
  }

  static goal(user_id, weight, deficit, callback) {
    if (!user_id || !weight || !deficit) {
      const error = new Error("Bad request");
      error.status = 400;
      console.log(user_id);
      throw error;
    }

    var query = connection.query(
      "INSERT INTO goal SET user_id = ?, poids = ?, deficit = ? ON DUPLICATE KEY UPDATE poids = ?, deficit = ?",
      [user_id, weight, deficit, weight, deficit],
      function (error, results) {
        if (error) throw error;
        callback(results);
        console.log(query.sql);
      }
    );
  }
}

module.exports = User;
