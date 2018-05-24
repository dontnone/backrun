let devHttp = '/'
if (process.env.NODE_ENV == "development") {
    devHttp = "http://localhost:8080/hd/";
}
const urlParams = {
    login: devHttp + "login", //..登录
    getAlluser: devHttp + 'users',  //..获取所有用户
    addUser: devHttp + 'users', //..添加用户,编辑用户
    getAllJobs: devHttp + 'jobs',
    downFiles: devHttp + 'files',
    tokenUpdate: devHttp + 'tokens'
};

export default urlParams;
