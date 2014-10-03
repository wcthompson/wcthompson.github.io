var myApp = angular.module('myApp', []);

myApp.controller('MainCtrl', ['$scope', '$sce', function ($scope, $sce){
	$scope.text = "";
	$scope.header = "";
  $scope.contentImage = "";
  $scope.showContentImage = false;
  
	$scope.getContent = function (tag) {
		if (tag === "#about") {
			$scope.header = "About";
      $scope.showContentImage = false;
			$scope.text = "<h3> Yo, I'm Will, programmer, new yorker, 24/7 human being. Currently a full-time computer science student at Brown University, \
                      but check out some of the stuff I've done by clicking on the bouncing icons!</h3>";
		}
		else if(tag === "#resume"){
			$scope.header = "Resume";
      $scope.showContentImage = false;
			$scope.text ="<h3>Check out <a href='./resume.pdf'> my resume </a>. </h3>";
		}
		else if(tag === "brown"){
			$scope.header = "Brown University";
      $scope.showContentImage = false;
			$scope.text ="<h3> I'm currently a sophomore at Brown University, expected class of 2017 with a Bachelors of Science in Computer Science. \
                      I'm taking a bunch of cool systems and computer engineering classes this year.</h3>";
		}
		else if(tag === "fogcreek"){
			$scope.header = "Fog Creek Software";
			$scope.text ="<h3>During the summer of 2013, I worked at Fog Creek Software as a support engineering intern. I made <a href='https://github.com/FogCreek/solari-board'>this cool thing.</a> </h3>";
      $scope.showContentImage = true;
      $scope.contentImage = "image/solari.png";
		}
		else if(tag === "google"){
			$scope.header = "Engineering Practicum Intern at Google";
			$scope.text ="<h3>For the summer of 2014 I got the west coast experience as an intern on the Kernel Testing Team in the infrastructure division of Google's Mountain View campus. \
                    Here's a really pretty picture I took of the golden gate bridge:</h3>";
    $scope.contentImage = "image/bridge.jpg";
    $scope.showContentImage = true;
		}
		else if(tag === "frc"){
			$scope.header = "FIRST Robotics";
			$scope.text ="<h3>Even though I haven't participated in the FIRST robotics competition since high school, it had a huge impact on my career path and skillset. \
                    Even as a Computer Scientist I wont let pesky hardware problems stop me!</h3>";
      $scope.contentImage = "image/robot.jpg";
      $scope.showContentImage = true;
		}
        else if(tag === "hack"){
            $scope.header = "Hack@Brown";
            $scope.text ="<h3>Hack@Brown is more than just Brown's annual hackathon-we're an organization trying to change the hackathon culture to be more open and accessible to students of all backgrounds. \
                    In addition to putting on the hackathon in January, we teach workshops on skills not necessarily taught in class and work to generally improve openness and diversity in computer science.</h3>";
      $scope.contentImage = "image/thankyou.png";
      $scope.showContentImage = true;
        }
		
    $scope.trustedHtml = $sce.trustAsHtml($scope.text);
	};

  $scope.getContent('#about');
}]);
