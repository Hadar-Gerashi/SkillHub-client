import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { AppBar, Box, Tabs, Tab, Container, Toolbar, Avatar, IconButton, Menu, MenuItem, Typography, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

import { userOut } from "../../features/userSlice.js";
import IconCart from "../cart/IconCart.jsx";
import { deleteCart } from "../../features/cartSlice.js";


const pages = ["/cart", "/home", "/", "/add", "/login", "/signup", "/orders"];
const namePages = [<IconCart />, "Home", "Courses", "Add Course", "Login", "Signup", "Orders"];
const settings = ["My Orders", "Log Out"];

function NavBar() {
  const user = useSelector((state) => state.users.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [value, setValue] = useState(0);
  const location = useLocation();

  // קביעת הערך של הטאב הנבחר לפי הנתיב הנוכחי
  const currentTab = pages.includes(location.pathname) ? location.pathname : "/home";

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed" sx={{
      backgroundColor: "rgba(124, 123, 123, 0.39)",
      top: 0,
      zIndex: 1000,
      height: "65px",
      backdropFilter: "blur(10px)",
    }}>

      <Container maxWidth="xl">


        <Toolbar disableGutters>
          <img src="../images/hh.png" alt="hh" width="150px" height="120px" />

          <Box sx={{ flexGrow: 1, display: "flex", height: "55px", marginTop: "-15px" }}>
            <Tabs value={currentTab} onChange={handleChange} textColor="secondary" indicatorColor="secondary" sx={{
              '& .MuiTabs-indicator': { backgroundColor: 'white' },
              '& .MuiTab-root': { color: 'white', minWidth: "120px", mx: 1 },
              '& .MuiTab-root.Mui-selected': { color: 'white' },
            }}>
              {pages.map((page, index) =>
                (page === "/add" && user?.role !== "ADMIN") ||
                  ((page === "/login" || (page === "/signup" && user?.role !== "ADMIN")) && user) ||
                  (page === "/orders" && user?.role !== "ADMIN")
                  ? null
                  : (
                    <Tab
                      key={page}
                      value={page}
                      label={namePages[index]}
                      component={Link}
                      to={page}
                      sx={{

                        "&.Mui-selected": {

                          fontWeight: "bold",
                          borderRadius: "10px"
                        }
                      }}
                    />
                  )
              )}

            </Tabs>
          </Box>

          {user && (
            <Box sx={{ flexGrow: 0, marginTop: "-15px" }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: "white", color: "black" }}>
                    {user.name
                      .split(" ")
                      .map((n) => n[0].toUpperCase())
                      .join("")}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      if (setting === "Log Out") {
                        dispatch(userOut());
                        dispatch(deleteCart());
                      } else if (setting === "My Orders") {
                        navigate("myOrders");
                      }
                      handleCloseUserMenu();
                    }}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {setting} {setting === "Log Out" ? <LogoutIcon fontSize="small" /> : null}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
