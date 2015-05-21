'use strict';

// Notices controller
angular.module('notices').controller('NoticesController', ['$scope', '$confirm', '$stateParams', '$location', 'Authentication', 'Notices',
	function($scope, $confirm, $stateParams, $location, Authentication, Notices, Templates) {
		$scope.authentication = Authentication;


		// Create new Notice
		$scope.create = function() {

			var notice = new Notices ({
				notice_type: this.type,
				subject: this.noticeForm.subject,
				status: 'active',
				auto_update: this.update_time,
				ticket_number: this.ticket,
				priority: this.priority,
				impacted_services: this.noticeForm.impacted_services,
				description: this.noticeForm.description,
				status_update: this.noticeForm.status_update,
				outage_start_time: this.outage_start_time,
				affected_regions: this.noticeForm.affected_regions,
				// workaround: this.noticeForm.workaround,
				email_dlist: this.noticeForm.email_dlist

			});
			// display confirmation dialog to ensure they really want to submit the notice
			$confirm({text: 'Are you sure you want to create this notice?'}).then(function() {
				// Create new Notice object
			

			// Redirect after save
			notice.$save(function(response) {
				// $location.path('notices/' + response._id);
				//redirect to dashboard
				$location.path('/');


			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		});

			};
			

		// Remove existing Notice
		$scope.remove = function(notice) {
			if ( notice ) { 
				notice.$remove();

				for (var i in $scope.notices) {
					if ($scope.notices [i] === notice) {
						$scope.notices.splice(i, 1);
					}
				}
			} else {
				$scope.notice.$remove(function() {
					$location.path('notices');
				});
			}
		};

		// checker function to show additional drop down fields based on update type (update/resolution)
		//default to false
		this.check = false;

		$scope.updateCheck = function() {
			var update_type = this.notice.status;

			if (update_type === 'closed') {
				this.check = true;
			} else {
				this.check = false;
			}
		};
		// Update existing Notice
		$scope.update = function() {
			var notice = $scope.notice;

			notice.$update(function() {
				$location.path('/');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Notices
		$scope.find = function() {
			$scope.notices = Notices.query();
		};

		// Find existing Notice
		$scope.findOne = function() {
			$scope.notice = Notices.get({ 
				noticeId: $stateParams.noticeId
			});		
		};

		// find latest notice based on state (active | closed)
		$scope.findLatest= function() {
			$scope.notice = Notices.getLatest();
		};

		// get template info
		$scope.templates = Notices.getTemplates();

		/**
		* Get node server environment variables
		* this will help set debug options
		*/
		
		// $scope.server = Notices.getEnv();



	}

]);