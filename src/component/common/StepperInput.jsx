import { Button, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { increaseQty, decreaseQty } from "../../features/cartSlice.js";

const StepperInput = ({ value, course, step = 1, min = 1, max = 5, onChange }) => {
  let dispatch = useDispatch();
  let cart = useSelector((state) => state.cart.arr);
  let item = cart.find((item) => item._id === course._id);
  let count = item ? item.qty : min;

  const handleIncrease = () => {
    if (count < max) {
      dispatch(increaseQty(course));
      onChange && onChange(count + step);
    }
  };

  const handleDecrease = () => {
    if (count > min) {
      dispatch(decreaseQty(course));
      onChange && onChange(count - step);
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" sx={{ border: "1px solid #ccc", borderRadius: "2px", width: "100px", height: "30px" }}>
      <Button
        variant="outlined"
        onClick={handleDecrease}
        disabled={count <= min}
        sx={{ minWidth: "30px", width: "30px", height: "30px", color: "black", border: "none", borderRight: "1px solid #ccc", borderRadius: "2px" }}
      >
        -
      </Button>

      <Typography variant="body1" sx={{ flexGrow: 1, textAlign: "center" }}>{count}</Typography>

      <Button
        variant="outlined"
        onClick={handleIncrease}
        disabled={count >= max}
        sx={{ minWidth: "30px", width: "30px", height: "30px", color: "black", border: "none", borderLeft: "1px solid #ccc", borderRadius: "2px" }}
      >
        +
      </Button>
    </Box>
  );
};

export default StepperInput;
