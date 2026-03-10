import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  AppBar, Box, Tabs, Tab, Container, Toolbar, Avatar, IconButton,
  Menu, MenuItem, Typography, Tooltip, Divider, Drawer, List,
  ListItem, ListItemText, ListItemButton, useMediaQuery, useTheme
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";

import { userOut } from "../../features/userSlice.js";
import IconCart from "../cart/IconCart.jsx";
import { deleteCart } from "../../features/cartSlice.js";

const pages = ["/cart", "/home", "/", "/add", "/my-courses", "/login", "/signup", "/orders", "/admin"];
const namePages = [<IconCart />, "Home", "Courses", "Add Course", "My Courses", "Login", "Signup", "Orders", "Admin Panel"];

function getInstructorMenuItem(user) {
  if (!user) return null;
  if (user.role === "INSTRUCTOR")
    return { label: "✓ Instructor", color: "#4ade80", link: null, clickable: false };
  if (user.instructorRequestStatus === "PENDING")
    return { label: "Instructor Request: Pending", color: "#fbbf24", link: "/become-instructor", clickable: true };
  if (user.instructorRequestStatus === "REJECTED")
    return { label: "✗ Request Rejected — Apply Again", color: "#f87171", link: "/become-instructor", clickable: true };
  if (user.role === "USER")
    return { label: "Become Instructor", color: "#a0aec0", link: "/become-instructor", clickable: true };
  return null;
}

function NavBar() {
  const user = useSelector((state) => state.users.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const currentTab = pages.includes(location.pathname) ? location.pathname : "/home";

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  const instructorMenuItem = getInstructorMenuItem(user);

  const shouldHideTab = (page) => {
    if (page === "/add" && user?.role !== "ADMIN" && user?.role !== "INSTRUCTOR") return true;
    if (page === "/my-courses" && user?.role !== "INSTRUCTOR") return true;
    if (page === "/admin" && user?.role !== "ADMIN") return true;
    if (page === "/orders" && user?.role !== "ADMIN") return true;
    if ((page === "/login" || page === "/signup") && user) return true;
    return false;
  };

  const visiblePages = pages.filter((page) => !shouldHideTab(page));

  const drawerContent = (
    <Box sx={{ width: 260, height: "100%", bgcolor: "rgba(30,30,30,0.97)", color: "white", pt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, mb: 1 }}>
        <img src="../images/hh.png" alt="hh" width="120px" height="95px" />
        <IconButton onClick={toggleDrawer} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.15)", mb: 1 }} />
      <List>
        {visiblePages.map((page) => {
          const globalIdx = pages.indexOf(page);
          const label = namePages[globalIdx];
          return (
            <ListItem key={page} disablePadding>
              <ListItemButton
                component={Link}
                to={page}
                selected={location.pathname === page}
                onClick={toggleDrawer}
                sx={{
                  color: "white",
                  "&.Mui-selected": { bgcolor: "rgba(255,255,255,0.12)", fontWeight: "bold" },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                  borderRadius: 1, mx: 1,
                }}
              >
                <ListItemText
                  primary={typeof label === "string" ? label : "Cart"}
                  primaryTypographyProps={{ fontSize: "0.95rem" }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {user && (
        <>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.15)", my: 1 }} />
          {instructorMenuItem && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  if (instructorMenuItem.clickable) { navigate(instructorMenuItem.link); toggleDrawer(); }
                }}
                sx={{ mx: 1, borderRadius: 1 }}
              >
                <Typography sx={{ fontSize: "0.85rem", color: instructorMenuItem.color, fontWeight: 600 }}>
                  {instructorMenuItem.label}
                </Typography>
              </ListItemButton>
            </ListItem>
          )}
          <ListItem disablePadding>
            <ListItemButton onClick={() => { navigate("/myOrders"); toggleDrawer(); }} sx={{ mx: 1, borderRadius: 1 }}>
              <ListItemText primary="My Orders" primaryTypographyProps={{ color: "white", fontSize: "0.95rem" }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => { dispatch(userOut()); dispatch(deleteCart()); toggleDrawer(); }}
              sx={{ mx: 1, borderRadius: 1 }}
            >
              <ListItemText primary="Log Out" primaryTypographyProps={{ color: "#f87171", fontSize: "0.95rem" }} />
              <LogoutIcon fontSize="small" sx={{ color: "#f87171" }} />
            </ListItemButton>
          </ListItem>
        </>
      )}
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{
        backgroundColor: "rgba(124, 123, 123, 0.39)",
        top: 0, zIndex: 1000, height: "65px",
        backdropFilter: "blur(10px)",
      }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: "65px", display: "flex", alignItems: "center" }}>

            <img
              src="../images/hh.png"
              alt="hh"
              width={isMobile ? "120px" : "150px"}
              height={isMobile ? "95px" : "120px"}
              style={{ marginTop: "15px" }}
            />

            {isMobile ? (
              <>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton onClick={toggleDrawer} sx={{ color: "white" }}>
                  <MenuIcon fontSize="large" />
                </IconButton>
              </>
            ) : (
              <>
                <Box sx={{ flexGrow: 1, display: "flex", height: "55px", mt: "5px" }}>
                  <Tabs
                    value={currentTab}
                    textColor="secondary"
                    indicatorColor="secondary"
                    sx={{
                      '& .MuiTabs-indicator': { backgroundColor: 'white' },
                      '& .MuiTab-root': { color: 'white', minWidth: "100px", mx: 0.5 },
                      '& .MuiTab-root.Mui-selected': { color: 'white' },
                    }}
                  >
                    {pages.map((page, index) =>
                      shouldHideTab(page) ? null : (
                        <Tab
                          key={page}
                          value={page}
                          label={namePages[index]}
                          component={Link}
                          to={page}
                          sx={{ "&.Mui-selected": { fontWeight: "bold", borderRadius: "10px" } }}
                        />
                      )
                    )}
                  </Tabs>
                </Box>

                {user && (
                  <Box sx={{ flexGrow: 0, mt: "5px" }}>
                    <Tooltip title="Open settings">
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Box sx={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
                          <Avatar sx={{ bgcolor: "white", color: "black" }}>
                            {user.name.split(" ").map((n) => n[0].toUpperCase()).join("")}
                          </Avatar>
                          {(user.role === "ADMIN" || user.role === "INSTRUCTOR") && (
                            <Box sx={{
                              position: "absolute",
                              bottom: -9,
                              left: "50%",
                              transform: "translateX(-50%)",
                              bgcolor: user.role === "ADMIN" ? "#ef4444" : "#4ade80",
                              color: user.role === "ADMIN" ? "#fff" : "#052e16",
                              fontSize: "0.5rem",
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              px: "6px",
                              py: "1.5px",
                              borderRadius: "4px",
                              whiteSpace: "nowrap",
                              lineHeight: 1.5,
                              boxShadow: "0 1px 5px rgba(0,0,0,0.5)",
                              border: "1px solid rgba(255,255,255,0.2)",
                            }}>
                              {user.role === "ADMIN" ? "ADMIN" : "INSTRUCTOR"}
                            </Box>
                          )}
                        </Box>
                      </IconButton>
                    </Tooltip>

                    <Menu
                      sx={{ mt: "45px" }}
                      anchorEl={anchorElUser}
                      anchorOrigin={{ vertical: "top", horizontal: "right" }}
                      keepMounted
                      transformOrigin={{ vertical: "top", horizontal: "right" }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      {instructorMenuItem && (
                        <>
                          <MenuItem
                            onClick={() => {
                              if (instructorMenuItem.clickable) { navigate(instructorMenuItem.link); handleCloseUserMenu(); }
                            }}
                            sx={{ cursor: instructorMenuItem.clickable ? "pointer" : "default" }}
                          >
                            <Typography sx={{ fontSize: "0.85rem", color: instructorMenuItem.color, fontWeight: 600 }}>
                              {instructorMenuItem.label}
                            </Typography>
                          </MenuItem>
                          <Divider />
                        </>
                      )}

                      <MenuItem onClick={() => { navigate("/myOrders"); handleCloseUserMenu(); }}>
                        <Typography>My Orders</Typography>
                      </MenuItem>

                      <MenuItem onClick={() => { dispatch(userOut()); dispatch(deleteCart()); handleCloseUserMenu(); }}>
                        <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          Log Out <LogoutIcon fontSize="small" />
                        </Typography>
                      </MenuItem>
                    </Menu>
                  </Box>
                )}
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{ sx: { bgcolor: "transparent", boxShadow: "none" } }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export default NavBar;