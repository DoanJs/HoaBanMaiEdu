// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {

//     // FUNCTION

//     function getUserRole() {
//       return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
//     }

//     function getPlan(planId) {
//        return get(/databases/$(database)/documents/plans/$(planId));
//     }

//      function getPlanTask(planTaskId) {
//         return get(/databases/$(database)/documents/planTasks/$(planTaskId));
//   }

//     function getChild(childId) {
//          return get(/databases/$(database)/documents/children/$(childId));
//     }

//     function isAdmin() {
//       return request.auth != null && getUserRole() == "admin";
//     }

//     function isTeacher() {
//       return request.auth != null && getUserRole() == "teacher";
//     }

//     function isManager() {
//       return request.auth != null && getUserRole() == "manager";
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
//         || (isTeacher() && request.auth.uid in getChild(resource.data.childId).data.teacherIds)
//         || (isManager() && request.auth.uid in getChild(resource.data.childId).data.managerIds);

//       allow create: if isTeacher()
//              && request.auth.uid in getChild(request.resource.data.childId).data.teacherIds
//              && request.resource.data.status == "pending";
//       allow update, delete: if isTeacher()
//              && request.auth.uid in getChild(resource.data.childId).data.teacherIds
//              && resource.data.status == "pending";

//       allow write: if isAdmin();
//     }

//     // PLANTASKS
//     match /planTasks/{planTaskId} {
//       allow read: if isAdmin() 
//              || (isTeacher() && request.auth.uid in getChild(getPlan(resource.data.planId).data.childId).data.teacherIds) 
//              || (isManager() && request.auth.uid in getChild(getPlan(resource.data.planId).data.childId).data.managerIds)

//       allow create: if isTeacher() 
//              && request.auth.uid in getChild(getPlan(request.resource.data.planId).data.childId).data.teacherIds 
//              && getPlan(request.resource.data.planId).data.status == "pending";

//       allow update, delete: if isTeacher() 
//              && request.auth.uid in getChild(getPlan(resource.data.planId).data.childId).data.teacherIds
//              && getPlan(resource.data.planId).data.status == "pending";

//       // Admin toàn quyền
//       allow write: if isAdmin();
//     }

//     // REPORTS
//     match /reports/{reportId} {
//       allow read: if isAdmin()
//         || (isTeacher() && request.auth.uid in getChild(resource.data.childId).data.teacherIds)
//         || (isManager() && request.auth.uid in getChild(resource.data.childId).data.managerIds);

//       allow create: if isTeacher()
//              && request.auth.uid in getChild(request.resource.data.childId).data.teacherIds
//              && request.resource.data.status == "pending";

//       allow update, delete: if isTeacher()
//              && request.auth.uid in getChild(resource.data.childId).data.teacherIds
//              && resource.data.status == "pending";

//       allow write: if isAdmin();


//     }

//      //REPORTTASKS
//      // READ
//      match /reportTasks/{reportTaskId} {
//          allow read: if isAdmin()
//              || (isTeacher() && request.auth.uid in getChild(getPlan(getPlanTask(resource.data.planTaskId).data.planId).data.childId).data.teacherIds)
//              || (isManager() && request.auth.uid in getChild(getPlan(getPlanTask(resource.data.planTaskId).data.planId).data.childId).data.managerIds);

//       // CREATE
//          allow create: if isTeacher()
//              && request.auth.uid in getChild(getPlan(getPlanTask(request.resource.data.planTaskId).data.planId).data.childId).data.teacherIds
//              && getPlan(getPlanTask(request.resource.data.planTaskId).data.planId).data.status == "approved";

//      // UPDATE / DELETE
//          allow update, delete: if isTeacher()
//              && request.auth.uid in getChild(getPlan(getPlanTask(resource.data.planTaskId).data.planId).data.childId).data.teacherIds
//              && getPlan(getPlanTask(resource.data.planTaskId).data.planId).data.status == "approved";
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
