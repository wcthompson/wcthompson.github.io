var myApp = angular.module('myApp', []);

myApp.controller('MainCtrl', ['$scope', '$sce', function ($scope, $sce){
    $scope.text = "";
    $scope.topic = "";
  $scope.contentImage = "";
  $scope.showContentImage = false;
  
    $scope.getContent = function (tag) {
        if (tag === "about") {
            $scope.topic = "About";
            $scope.showContentImage = false;
            $scope.text = "<h3> Hey there! I'm a computer science student at Brown University with a passion for cool projects and 24-hour subway systems. </h3>";
        }
        else if (tag === "work") {
            $scope.topic = "Work";
            $scope.showContentImage = false;
            $scope.text = "<div><img src='image/tumblr.png'><div><img src='image/hack.png'></div></div> <div><img src='image/google.png'></div> <div><img src='image/fogcreek.png'></div>";
        }
        else if(tag === "brown"){
            $scope.topic = "Brown University";
        }
        else if(tag === "fogcreek"){
            $scope.topic = "Fog Creek Software";
            $scope.text ="<h3>During the summer of 2013, I worked at Fog Creek Software as a support engineering intern. I made <a href='https://github.com/FogCreek/solari-board'>this cool thing.</a> </h3>";
            $scope.showContentImage = true;
            $scope.contentImage = "image/solari.png";
        }
        else if(tag === "google"){
            $scope.topic = "Engineering Practicum Intern at Google";
            $scope.text ="<h3>For the summer of 2014 I got the west coast experience as an intern on the Kernel Testing Team in the infrastructure division of Google's Mountain View campus. \
                        Here's a really pretty picture I took of the golden gate bridge:</h3>";
            $scope.contentImage = "image/bridge.jpg";
            $scope.showContentImage = true;
        }
        else if(tag === "tumblr"){
            $scope.topic = "Software Engineering Intern at Tumblr";
            $scope.text ="<h3>Even though I haven't participated in the FIRST robotics competition since high school, it had a huge impact on my career path and skillset. \
                        Even as a Computer Scientist I wont let pesky hardware problems stop me!</h3>";
             $scope.contentImage = "image/robot.jpg";
              $scope.showContentImage = true;
        }
        else if(tag === "hack"){
            $scope.topic = "Hack@Brown";
            $scope.text ="<h3>Hack@Brown is more than just Brown's annual hackathon-we're an organization trying to change hackathon culture to be more accessible to students of all backgrounds. \
                        In addition to putting on the hackathon in January, we teach workshops on skills not necessarily taught in class and work to generally improve openness and diversity in computer science.</h3>";
            $scope.contentImage = "image/thankyou.png";
            $scope.showContentImage = true;
        }
            
        $scope.trustedHtml = $sce.trustAsHtml($scope.text);
    };

  $scope.getContent('about');
}]);
