import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const drawerContent = (
  <Box role="presentation" onClick={toggleDrawer(false)}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
          <img
            src="/logo192.png"
            alt="logo"
            style={{ width: 32, height: 32, borderRadius: "50%" }}
          />
          <Typography variant="h6" component="div">
            AI Mail Support
          </Typography>
        </Box>
    <Divider />
    {/* <List>
      <ListItem disablePadding>
        <ListItemButton onClick={handleOpenMenu}>
          <Avatar alt="Profile" src="" sx={{ mr: 1 }} />
          <ListItemText primary="Profile" />
        </ListItemButton>
      </ListItem>
    </List> */}
    <List>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemText primary="Profile" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemText primary="About" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemText primary="Contact" />
        </ListItemButton>
      </ListItem>
    </List>
  </Box>
);



  return (
    <AppBar position="sticky" elevation={1} color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left: Logo + Name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src="/logo192.png"
            alt="logo"
            style={{ width: 32, height: 32, borderRadius: "50%" }}
          />
          <Typography variant="h6" component="div">
            AI Mail Support Assistant
          </Typography>
        </Box>

        {/* Right: Desktop Nav or Mobile Hamburger */}
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              edge="end"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)} PaperProps={{
    sx: {
      bgcolor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      width: 250, // keep your drawer width here
    },
  }}>
              {drawerContent}
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button color="inherit">About</Button>
            <Button color="inherit">Contact</Button>
            <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
              <Avatar alt="Profile" src="" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
              <MenuItem onClick={handleCloseMenu}>Other</MenuItem>
              <MenuItem onClick={handleCloseMenu}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
