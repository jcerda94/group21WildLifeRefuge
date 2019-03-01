/*
Created by: Thongphanh Duanboudda
Date: 2/27/2019
Version: V.1
Reference: https://davidburgos.blog/how-to-calculate-the-distance-between-2-meshes-in-threejs/
Update:

 */


function FindDistance(mesh1, mesh2) {

    const dx = mesh1.position.x - mesh2.position.x;
    const dy = mesh1.position.y - mesh2.position.y;
    const dz = mesh1.position.z - mesh2.position.z;

    return Math.sqrt(dx*dx+dy*dy+dz*dz);
}

export default FindDistance