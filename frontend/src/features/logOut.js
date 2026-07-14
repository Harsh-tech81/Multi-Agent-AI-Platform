
import api from '../../utils/axios';

async function logOut() {
    try{
        const {data}=await api.get('/api/auth/logout');
        console.log('Logout successful:', data);
    }
    catch(error){
        console.log('Error occurred while logging out:', error);
    }

}

export default logOut;