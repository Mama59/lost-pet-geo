(() => {
  'use strict';

  angular
    .module('updatePet')
    .controller('UpdatePetCtrl', updatePetController);

  updatePetController.$inject = ['$ionicPlatform', '$ionicLoading', '$timeout', '$ionicActionSheet', 'PetService', '$stateParams'];

  function updatePetController($ionicPlatform, $ionicLoading, $timeout, $ionicActionSheet, PetService, $stateParams) {
    let self = this;

    function getSpecies(id) {
      self.loaders.species = true;

      PetService.getSpecies(id).then(function (results) {
        if(id) {
          for (var index in results) {
            var result = results[index];
            if (result._id === id) {
              self.pet.species = result;
            }
          }
        }
        self.species = results;
      }).finally(function () {
        self.loaders.species = false;
      });
    }

    self.getBreeds = function (id) {
      self.loaders.breeds = true;
      if (!self.breeds[self.pet.species._id]) {
        PetService.getBreeds(self.pet.species._id).then(function (results) {
          if(id){
            for (var index in results) {
              var result = results[index];
              if (result._id === id) {
                self.pet.breed = result;
              }
            }
          }
          self.breeds[self.pet.species._id] = results;
        }).finally(function () {
          self.loaders.breeds = false;
        });
      }
    };


    self.updatePet = function () {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });

      PetService.updatePet(self.pet).then(function (result) {
        console.log(result);
      }).finally(function () {
        $timeout(function () {
          $ionicLoading.hide();
        }, 1000);
      });
    };

    function updateImage() {
      $ionicPlatform.ready(function () {
        if (window.cordova) {
          capturePhoto();
        }
      });
      return true;
    }

    function importPhoto() {
      $ionicPlatform.ready(function () {
        if (window.cordova) {
          var source = self.pictureSource.PHOTOLIBRARY;
          getPhoto(source);
        }
      });
      return true;
    }

    function showIonicLoading() {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });
    }

    function hideIonicLoading() {
      $timeout(function () {
        $ionicLoading.hide();
      }, 500);
    }


    function onDeviceReady() {
      self.pictureSource = navigator.camera.PictureSourceType;
      self.destinationType = navigator.camera.DestinationType;
    }

    function onPhotoDataSuccess(imageData) {
      self.pet.photo = "data:image/jpeg;base64," + imageData;
      hideIonicLoading();
    }

    function capturePhoto() {
      showIonicLoading();
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 50,
        destinationType: self.destinationType.DATA_URL
      });
    }

    function getPhoto(source) {
      showIonicLoading();
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 50,
        destinationType: self.destinationType.DATA_URL,
        sourceType: source
      });
    }

    function deletePicture() {
      self.pet.photo = "";
      return true;
    }

    self.takePhoto = function () {
      var opts = {
        buttons: [
          {text: 'Prendre une photo'},
          {text: 'Photo de la librairie'}
        ],
        titleText: 'Photo',
        cancelText: 'Annuler',
        cancel: function () {
          return true;
        },
        buttonClicked: function (index) {
          if (index === 0) {
            return updateImage();
          }

          if (index === 1) {
            return importPhoto();
          }

          return true;
        }
      };
      if (self.pet.photo) {
        opts.destructiveText = "Supprimer";
        opts.destructiveButtonClicked = deletePicture;
      }

      $ionicActionSheet.show(opts);
    };

    function onFail() {
      hideIonicLoading();
    }

    function getPet() {
      PetService.getPet(self.petId).then(function (result) {
        self.pet = result;
        resetSpecies(self.pet.speciesId);
      });
    }

    function reset() {
      self.loaders = {};
      self.images = [];
      getPet();
    }

    function resetSpecies(id) {
      self.species = [];
      getSpecies(id);
    }

    function init() {
      self.breeds = {};
      self.petId = $stateParams.petId;
      reset();
    }


    init();
  }
})
();
