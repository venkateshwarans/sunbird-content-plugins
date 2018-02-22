/**
 * Plugin to create MCQ question
 * @class org.ekstep.questionunitmcq:mcqQuestionFormController
 * Jagadish P<jagadish.pujari@tarento.com>
 */

angular.module('createquestionapp', [])
 .controller('ftbQuestionFormController', ['$scope', '$rootScope', function($scope, $rootScope) {

  $scope.formVaild = false;
  $scope.ftbFormData = {
    'question': { 'text': '', 'image': '', 'audio': '' },
    'answer': [],
    'parsedQuestion': { 'text': '', 'image': '', 'audio': '' }
  };

  $scope.init = function() {
    $('.menu .item').tab();
    $('.ui.dropdown').dropdown({ useLabels: false });

    if (!ecEditor._.isUndefined($scope.questionEditData)) {
      var data = $scope.questionEditData.data;
      $scope.ftbFormData.question = data.question;
    }

    $scope.$parent.$on('question:form:val', function(event) {
      var regexForAns = /(?:^|\s)\[\[(.*?)(?:\]\]|$)/g;
      var index = 0;
      $scope.ftbFormData.answer = $scope.getMatches($scope.ftbFormData.question.text, regexForAns, 1);
      if ($scope.formValidation()) {
        $scope.ftbFormData.parsedQuestion.text = $scope.ftbFormData.question.text.replace(/\[\[.*?\]\]/g,function(a, b){
          index = index +1;
          return '<input type="text" class="ans-field" id=ans-field"' + index + '">';
        })
        $scope.$emit('question:form:valid', $scope.ftbFormData);
      } else {
        $scope.$emit('question:form:inValid', $scope.ftbFormData);
      }
    })
  }

  

  $scope.getMatches = function(string, regex, index) {
    index || (index = 1); // default to the first capturing group
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
      matches.push(match[index]);
    }
    return matches;
  }

  $scope.formValidation = function() {
    $scope.submitted=true;
    var formValid = $scope.ftbForm.$valid && /\[\[.*?\]\]/g.test($scope.ftbFormData.question.text);
    return (formValid) ? true : false;
  }

  $scope.generateTelemetry = function(data, event) {
      if (data) ecEditor.getService('telemetry').interact({
        "type": data.type,
        "subtype": data.subtype,
        "id": data.id,
        "pageId": ecEditor.getCurrentStage().id,
        "target": {
          "id": event.target.id,
          "ver": "1.0",
          "type": data.type
        },
        "plugin": {
          "id": "org.ekstep.questionunit.ftb",
          "ver": "1.0"
        }
      })
    }

}]);
//# sourceURL=horizontalFTB.js