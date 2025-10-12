import { useSelector } from "react-redux";
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


//קומפוננטה להצגת איקון העגלה
const IconCart = () => {
  let count = useSelector(state => state.cart.count)


  return (<>
    <Badge sx={{
      '& .MuiBadge-badge': {
        backgroundColor: count > 0 ? 'teal' : '',
        color: 'white',
      }
    }} badgeContent={count} >
      <ShoppingCartIcon fontSize="large" />
    </Badge>
  </>);
}

export default IconCart;