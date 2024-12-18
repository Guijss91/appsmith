export default {
  hashPassword: function(password) {
    var bcrypt = dcodeIO.bcrypt;
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  }
}