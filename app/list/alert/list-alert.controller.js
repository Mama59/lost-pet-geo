(() => {
  angular
    .module('listAlert')
    .controller('ListAlertCtrl', listAlertController);

  listAlertController.$inject = ['AlertService', 'AccountService'];
  function listAlertController(AlertService, AccountService) {
    let self = this;

    self.delete = function (item) {
      AlertService.delete(item._id);
    };

    self.update = function (item) {
      AlertService.update(item);
    };

    function getListAlert() {
      self.loaders.getList = true;
      AlertService.getListAlert().then(function (results) {

        if (results.length) {
          for (var index in results) {
            var result = results[index];

            if (result.state === 'Perdu') {
              result.class = "assertive";
            }

            if (result.userId === self.userId) {
              result.isMyAlert = true;
            }
          }
        }

        self.listAlert = result;
      }).finally(function () {
        self.loaders.getList = false;
      });
    }

    function getAccountId() {
      self.userId = AccountService.getAccountId();
    }

    function init() {
      self.loaders = {getList: true};
      getAccountId();
      getListAlert();
    }

    init();
  }

})();
