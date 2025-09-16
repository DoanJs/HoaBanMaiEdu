// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
  
//   // FUNCTION
//     function getUserRole() {
//       return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role
//     }

//     function getPlan(planId) {
//        return get(/databases/$(database)/documents/plans/$(planId))
//     }

// 		function getReport(reportId) {
//        return get(/databases/$(database)/documents/reports/$(reportId))
//     }

//     function isAdmin() {
//       return request.auth != null && getUserRole() == "admin"
//     }

//     function isTeacher() {
//       return request.auth != null && getUserRole() == "teacher"
//     }

//     function isManager() {
//       return request.auth != null && getUserRole() == "manager"
//     }

//     // USERS
//     match /users/{userId} {
//       allow read: if isAdmin() || isTeacher() || isManager()

//       allow write: if isAdmin(); 
//     }

//     // CHILDREN
//     match /children/{childId} {
//       allow read: if isAdmin()
//         || (isTeacher() && request.auth.uid in resource.data.teacherIds)
//         || (isManager() && request.auth.uid in resource.data.managerIds);

//       allow write: if isAdmin();
//     }

//     // PLANS
//     match /plans/{planId} {
//       allow read: if isAdmin()
//       		|| (isTeacher() && request.auth.uid == resource.data.teacherId)
//         	|| (isManager() && request.auth.uid == resource.data.teacherId)

//       allow create: if isTeacher()
//              && request.auth.uid == request.resource.data.teacherId
//              && request.resource.data.status == "pending";
             
//       allow update, delete: if isTeacher()
//              && request.auth.uid == resource.data.teacherId
//              && resource.data.status == "pending";

//       allow write: if isAdmin();
//     }

//     // PLANTASKS
//     match /planTasks/{planTaskId} {
//       allow read: if isAdmin() 
//              || (isTeacher() && request.auth.uid == getPlan(resource.data.planId).data.teacherId) 
//              || (isManager() && request.auth.uid == getPlan(resource.data.planId).data.teacherId)

//       allow create: if isTeacher() 
//              && request.auth.uid == getPlan(request.resource.data.planId).data.teacherId 
//              && getPlan(request.resource.data.planId).data.status == "pending";

//       allow update, delete: if isTeacher() 
//              && request.auth.uid == getPlan(resource.data.planId).data.teacherId
//              && getPlan(resource.data.planId).data.status == "pending";

//       allow write: if isAdmin();
//     }

//     // REPORTS
//     match /reports/{reportId} {
//       allow read: if isAdmin()
//         || (isTeacher() && request.auth.uid == resource.data.teacherId)
//         || (isManager() && request.auth.uid == resource.data.teacherId);

//       allow create: if isTeacher()
//              && request.auth.uid == request.resource.data.teacherId
//              && request.resource.data.status == "pending";

//       allow update, delete: if isTeacher()
//              && request.auth.uid == resource.data.teacherId
//              && resource.data.status == "pending";

//       allow write: if isAdmin();
//     }

//      //REPORTTASKS
//      // READ
//      match /reportTasks/{reportTaskId} {
//          allow read: if isAdmin()
//              || (isTeacher() && request.auth.uid == getReport(resource.data.reportId).data.teacherId)
//              || (isManager() && request.auth.uid == getReport(resource.data.reportId).data.teacherId);

//       // CREATE
//          allow create: if isTeacher()
//              && request.auth.uid == getPlan(request.resource.data.planId).data.teacherId
//              && getPlan(request.resource.data.planId).data.status == "approved";

//      // UPDATE / DELETE
//          allow update, delete: if isTeacher()
//              && request.auth.uid == getPlan(resource.data.planId).data.teacherId
//              && getPlan(resource.data.planId).data.status == "approved";
//      }

//     // FIELDS
//     match /fields/{fieldId} {
//       allow read: if isAdmin() || isTeacher() || isManager()
//       allow write: if isAdmin();
//     }

//     // INTERVENTIONS
//     match /interventions/{interventionId} {
//       allow read: if isAdmin() || isTeacher() || isManager()
//       allow write: if isAdmin();
//     }

//     // TARGETS
//     match /targets/{targetId} {
//       allow read: if isAdmin() || isTeacher() || isManager()
//       allow write: if isAdmin();
//     }

//     // META
//     match /Meta/{metaId} {
//       allow read, update: if isAdmin() || isTeacher() || isManager()
//       allow write: if isAdmin()
//     }
//   }
// }
