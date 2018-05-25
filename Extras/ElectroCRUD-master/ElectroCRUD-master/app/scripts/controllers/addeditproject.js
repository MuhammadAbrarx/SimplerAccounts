'use strict';

/**
 * @ngdoc function
 * @name electroCrudApp.controller:AddeditprojectCtrl
 * @description
 * # AddeditprojectCtrl
 * Controller of the electroCrudApp
 */
angular.module('electroCrudApp')
  .controller('AddeditprojectCtrl', ['$scope', 'breadcrumb', 'projectsModel', '$route', '$routeParams',
    'mysql', 'SweetAlert', '$location', 'session', 'ngProgressFactory',
  function ($scope, breadcrumb, projectsModel, $route, $routeParams,
      mysql, SweetAlert, $location, session, ngProgressFactory) {
    $scope.editMode = ($route.current.$$route.controllerAs == "editProject");
    $scope.project = {
      'mysql_port': 3306,
      'connection_type': 'direct'
    };
    $scope.detailsFormValid = false;
    $scope.databases = [];
    $scope.projectId = undefined;
    $scope.progressbar = ngProgressFactory.createInstance();

    $scope.$watchCollection('project', function(newNames, oldNames) {
      $scope.detailsFormValid = formValidator();
    });
    $scope.$watch('project.connection_type', function(newVal, oldVal){
      if (newVal == "ssh") {
        $scope.project.mysql_host = "127.0.0.1";
      }
    });

    $scope.onCancelBtn = function() {
      $location.path("/projects");
    };

    $scope.detailsFormConnect = function(){
      if ($scope.detailsFormValid) {
        getMySQLDatabases();
      }
    };

    $scope.openDatabaseSelect = function(databaseName) {
      $scope.project.mysql_db = databaseName;
      $scope.databases.forEach(function(row){
        row.selected = ($scope.project.mysql_db == row.Database);
      });
      commitChanges();
    };

    $scope.onSaveBtn = function() {
      commitChanges();
    };

    if ($scope.editMode) {
      $scope.projectId = $routeParams.id;
      var data = projectsModel.getById($scope.projectId).then(function(result){
        initEdit(result.rows[0])
      });
    } else {
      breadcrumb.append("New Project", "#/projects/new");
    }

    function initEdit(data) {
      breadcrumb.append(data.name, "/#/projects/edit/"+data.id);
      $scope.project = data;
      getMySQLDatabases();
    }

    function formValidator() {
      var isValid = true;
      //name
      if (isValid && ( ! $scope.project.name || $scope.project.name.length < 3)) {
        isValid = false;
      }
      //mysql host
      if (isValid && ( ! $scope.project.mysql_host || $scope.project.mysql_host.length < 1)) {
        isValid = false;
      }
      //mysql port
      if (isValid && ( ! $scope.project.mysql_port || isNaN($scope.project.mysql_port))) {
        isValid = false;
      }
      //mysql user
      if (isValid && ( ! $scope.project.mysql_user || $scope.project.mysql_user.length < 1)) {
        isValid = false;
      }
      return isValid;
    }

    function getMySQLDatabases() {
      $scope.progressbar.start();

      mysql.getConnection($scope.project)
        .then(function(connection){
          connection.connect();
          mysql.getDatabases(connection)
            .then(function(results) {
              $scope.progressbar.complete();
              results.forEach(function(row){
                row.selected = ($scope.project.mysql_db == row.Database);
              });
              angular.copy(results, $scope.databases);
              $scope.$apply();
              mysql.closeConnection(connection);
            })
            .catch(function(err) {
              $scope.progressbar.complete();
              SweetAlert.swal("Error", err, "error");
              mysql.closeConnection(connection);
            });
        })
        .catch(function(err){
          $scope.progressbar.complete();
          SweetAlert.swal("Error", "", "error");
        });
    }

    function commitChanges() {
      if ($scope.editMode) {
        projectsModel.update($scope.projectId, $scope.project)
          .then(function(result){
            SweetAlert.swal("Success", "Project saving completed.", "success");
            $location.path("/projects");
          })
          .catch(function(err){
            SweetAlert.swal("Error", err, "error");
          });
      } else {
        projectsModel.add($scope.project.name, $scope.project.mysql_host,
                          $scope.project.mysql_port, $scope.project.mysql_user,
                          $scope.project.mysql_password, $scope.project.mysql_db,
                          $scope.project.connection_type, $scope.project.ssh_host,
                          $scope.project.ssh_user, $scope.project.ssh_password)
          .then(function(result){
            $scope.editMode = true;
            $scope.projectId = $scope.project.id = result.insertId;
            if (!$scope.project.mysql_db) {
              getMySQLDatabases();
            } else {
              SweetAlert.swal("Success", "Project saving completed.", "success");
              $location.path("/projects");
            }
          })
          .catch(function(err){
            SweetAlert.swal("Error", err, "error");
          });
      }
    }



  }]);
