// import React from 'react';
// export default function Display() {
//     const [sections,setSections] = React.useState([])
//     function Data(){
//         fetch("http://localhost:5000/api/faculty-admin/get-fac")
//         .then(response => response.json())
//         .then(data => {
//             setSections(data);
//         }) 
//     }
//     React.useEffect(()=>{
//         Data();
//     },[])
//     let ID=sections[0]?._id;
//     let Name=sections[0].FullName;
//     let email=sections[0]?.Email;
//     //console.log(ID,Name,email)       
//     return (
//         <div>
//             <h1>Display Page</h1>
//             <table>
//                     <tr>
//                         <th>ID:</th>
//                         <th>{ID}</th>
//                     </tr>
//                     <tr>
//                         <th>Name:</th>
//                         <th>{Name}</th>
//                     </tr>
//                     <tr>
//                         <th>email:</th>
//                         <th>{email}</th>
//                     </tr>

//             </table>
//         </div>
//     );
// }