import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
    const navigate = useNavigate();

    function NavigateToLogin(){
        navigate("/auth/login");
    }

    return (
        <>
            <div onClick={NavigateToLogin} className="relative ps-2 pe-1 py-1 font-medium transition-all text-gray-500 cursor-pointer">
                <AccountCircleOutlinedIcon />
            </div>
        </>
    ) 
}