import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
} from "@mui/material";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useContext } from "react";
//import { AuthContext } from '../../context/AuthContext';
import { AuthContext } from "../../context2/AuthContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import TabSection from "../../components/properties/TabSection";
import TableHead from "../../components/Table/TableHead";
import {
  DateFormat,
  PropertyCurrentStatus,
  PropertyTypeFunction,
  ShowPrice,
} from "../../components/Functions";
import "../../components/Table/table.css";
import Filter from "../../components/Table/Filter";
import SearchBar from "../../components/Table/SearchBar";

import SkeletonTable from "../../components/Table/SkeletonTable";
import NoData from "../../components/Table/NoData";
import TablePagination from "../../components/Table/TablePagination";
import {
  ArrowDown,
  ArrowUp,
  DeleteIcon,
  EditIcon,
  ListAgainIcon,
  MarkIcon,
  ViewIcon,
} from "../../components/SvgIcons";
import DeleteDialog from "../../components/dialogComp/DeleteDialog";
import PropertyStatusDialog from "../../components/dialogComp/PropertyStatusDialog";
import Loader from "../../components/loader/Loader";

// const SkeletonRow = () => (
//   <div className="div-table-row">
//     {[...Array(9)].map((_, index) => (
//       <div key={index} className="div-table-cell">
//         <div className="skeleton" style={{
//           height: '20px',
//           background: '#e0e0e0',
//           borderRadius: '4px',
//           animation: 'pulse 1.5s ease-in-out infinite'
//         }} />
//       </div>
//     ))}
//   </div>
// );

const ActionDropdownMenu = [
  { to: "/viewProperty", title: "View property", icon: <ViewIcon /> },
  { to: "/editProperty", title: "Edit property", icon: <EditIcon /> },
  { to: "/editProperty", title: "Active", icon: <ListAgainIcon /> },
  { to: "/editProperty", title: "Mark as Sold", icon: <MarkIcon /> },
  { to: "/editProperty", title: "Delete", icon: <DeleteIcon /> },
];

// const ActionBtnDropdown = ({ pro_id, selectedItem, onAction }) => {
//   return (
//     <div className="action-dropdown css-1dhh8jv">
//       <span class="css-1egvoax"></span>
//       {ActionDropdownMenu.map((item, index) => (
//         <div
//           className={`action-dropdown-item ${
//             selectedItem === item.title ? "selected-action" : ""
//           }`}
//           //onClick={() => onAction(pro_id, "view")}
//           onClick={() => setSelectedItem(item.title)}
//         >
//           <span className="action-dropdown-icon">{item.icon}</span> {item.title}
//         </div>
//       ))}
//     </div>
//   );
// };

const ActionBtnDropdown = ({ pro_url, pro_id, selectedItem, onAction }) => {
  return (
    <div className="action-dropdown css-1dhh8jv">
      <span className="css-1egvoax"></span>
      {ActionDropdownMenu.map((item) => (
        <div
          key={item.title}
          className={`action-dropdown-item ${
            selectedItem === item.title ? "selected-action" : ""
          }`}
          onClick={() => onAction(pro_url, pro_id, item.title, item.to)}
        >
          <span className="action-dropdown-icon">{item.icon}</span> {item.title}
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const { currentUser, clearUser } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const [data, setData] = useState([]);
  const [snackQ, setSnackQ] = useState(false);
  const [snack, setSnack] = useState(false);
  const [loader, setLoader] = useState(false);
  //const [searchValue, setSearchValue] = useState("");
  const [change, setChange] = useState(0);
  //const [filter, setFilter] = useState("All");
  const [selectedAction, setSelectedAction] = useState();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [listingids, setListingids] = useState([]);
  const [snackDel, setSnackDel] = useState(false);
  const [allSelected, setAllSelected] = useState(false);

  const [totalViews, setTotalViews] = useState("");
  const [totalResponses, setTotalResponses] = useState("");
  const [listingiInLast30, setListingiInLast30] = useState([]);

  const [openInfoCard, setOpenInfoCard] = useState(false);
  const [filterChange, setFilterChange] = useState(1);
  //const [filteredData, setFilteredData] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState("All");
  const [propertyTypes, setPropertyTypes] = useState([]);

  const [openDropdownId, setOpenDropdownId] = useState(null); // Track which row's dropdown is open
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [proListingStatus, setProListingStatus] = useState({
    pro_listed: "",
    pro_id: "",
  });

  const [proSaleStatus, setProSaleStatus] = useState({
    sale_status: "",
    pro_id: "",
  });

  const [open, setOpen] = React.useState(false);
  const [data1, setData1] = useState();
  const handleClickOpen = (data) => {
    setData1(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openDel, setOpenDel] = useState(false);
  const [delId, setDelId] = useState("");
  const handleClickOpenDel = (data) => {
    setDelId(data);
    setOpenDel(true);
  };

  const handleCloseDel = () => {
    setOpenDel(false);
  };

  


  useEffect(() => {
    if (currentUser != null) {
      axios
        .get(
          import.meta.env.VITE_BACKEND +
            `/api/pro/fetchPropertyDataByUserId1/${currentUser?.user.id}`
        )
        .then((res) => {
          if (res.data === "failed") {
            clearUser();
          } else {
            const formattedData = res.data.map((item, i) => ({
              ...item,
              serial_no: i + 1,
              pro_modified_id: `LM-${7600 + parseInt(item.pro_id)}`,
            }));

            const uniquePropertyTypes = [
              "All",
              ...new Set(
                res.data
                  .map((item) => PropertyTypeFunction(item.pro_type))
                  .filter((type) => type)
              ),
            ];

            setData(formattedData);
            setPropertyTypes(uniquePropertyTypes);
            setDataLoaded(true);
          }
        });
    }
  }, [change, currentUser]);

  const stats = useMemo(
    () => ({
      totalViews: data.reduce(
        (acc, item) => acc + parseInt(item.pro_views1 || 0),
        0
      ),
      totalResponses: data.reduce(
        (acc, item) => acc + parseInt(item.pro_responses || 0),
        0
      ),
    }),
    [data]
  );

  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        if (filter === "All") {
          return true;
        }
        if (filter) {
          return PropertyTypeFunction(item.pro_type) === filter;
        }
        return true;
      })

      .filter((item) => {
        // Search filter
        if (!searchValue) return true;
        const normalizedSearch = searchValue.toLowerCase();
        return (
          item.pro_locality?.toLowerCase().includes(normalizedSearch) ||
          item.pro_sub_district?.toLowerCase().includes(normalizedSearch) ||
          item.pro_pincode?.startsWith(searchValue) ||
          item.pro_modified_id?.toString().startsWith(searchValue) ||
          item.pro_city?.toLowerCase().includes(normalizedSearch) ||
          item.pro_state?.toLowerCase().startsWith(normalizedSearch) ||
          item.pro_ad_type?.toLowerCase().startsWith(normalizedSearch)
        );
      });
  }, [data, filter, searchValue]);

  const records = filteredData.slice(firstIndex, lastIndex);
  const nPages = Math.ceil(filteredData.length / recordsPerPage);

  const theadArray = [
    // {
    //   value: (
    //     <Checkbox
    //       size="small"
    //       onClick={handleAllTypes}
    //       checked={allSelected}
    //       className="checkbox-alignment"
    //     />
    //   ),
    // },
    // { value: "Sno." },
    { value: "Id" },
    { value: "Property Type", customClass: "mobile-hidden-field" },
    {
      value: "Sale/Rent",
      customClass: "div-table-cell-pro_ad_type mobile-hidden-field",
    },
    { value: "Price", customClass: "mobile-hidden-field" },
    { value: "Posted On", customClass: "div-table-cell-date" },
    { value: "Expired On", customClass: "div-table-cell-date" },
    // { value: "Responses and Views" },
    { value: "Status", customClass: "div-table-cell-action-btn" },
    { value: "Actions", customClass: "div-table-cell-action-btn" },
    { value: "Remarks" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const deleteProperty = async () => {
    try {
      await axios.delete(
        import.meta.env.VITE_BACKEND + `/api/admin/deletePro/${delId}`
      );
      setSearchValue("");
      setChange(change + 1);
      setSnackDel(true);
      setOpenDel(false);
    } catch (err) {
      console.log(err);
    }
  };

  const listProperty = async (proid) => {
    setLoader(true);
    proListingStatus.pro_listed = 1;
    proListingStatus.pro_id = proid;
    console.log("proid 111111 : ", proid, actionProId);
    conflof.log("Ed");
    await axios.put(
      import.meta.env.VITE_BACKEND + "/api/pro/updateProListingStatus",
      proListingStatus
    );
    setChange(change + 1);
    setLoader(false);
    setSnack(true);
  };

  // const listMultipleProperty = async (list_status) => {
  //   setLoader(true);
  //   // proListingStatus.pro_listed = 1;
  //   // proListingStatus.pro_id = listingids;
  //   await axios.put(
  //     import.meta.env.VITE_BACKEND + "/api/pro/updateProListingMultipleStatus",
  //     { pro_listed: list_status, listingids: listingids }
  //   );
  //   setChange(change + 1);

  //   setLoader(false);
  //   setSnack(true);
  // };

  const delistProperty = async (proid) => {
    setOpen(false);
    setLoader(true);
    proListingStatus.pro_listed = 0;
    proListingStatus.pro_id = proid;
    await axios.put(
      import.meta.env.VITE_BACKEND + "/api/pro/updateProListingStatus",
      proListingStatus
    );
    setChange(change + 1);
    setLoader(false);
    setSnackQ(true);
  };

  const updateSaleStatus = async (data, val) => {
    setLoader(true);
    proSaleStatus.sale_status = val;
    proSaleStatus.pro_id = data.pro_id;
    await axios.put(
      import.meta.env.VITE_BACKEND + "/api/pro/updateSaleStatus",
      proSaleStatus
    );
    setChange(change + 1);
    setLoader(false);
    setSnack(true);
  };

  const handleAction = async (pro_url, pro_id, action, to) => {
    setSelectedItem(action);
    setOpenDropdownId(null);
    setActionProId(pro_id)
    try {
      switch (action) {
        case "View property":
          window.open(`https://propertyease.in/${pro_url}`, "_blank");
          break;
        case "Edit property":
          navigate(`${to}/${pro_url}`);
          break;
        case "Active":
          // await axios.put(
          //   `${import.meta.env.VITE_BACKEND}/api/pro/update/${pro_id}`,
          //   {
          //     pro_listed: 1,
          //   }
          // );
          // setChange(change + 1);
          // setSnack(true);
          handleOpenActivate()
          break;
        case "Mark as Sold":
          await axios.put(
            `${import.meta.env.VITE_BACKEND}/api/pro/update/${pro_id}`,
            {
              pro_sold: 1,
            }
          );
          setChange(change + 1);
          setSnack(true);
          break;
        case "Delete":
          //setSelectedProId(pro_id);
          //setOpenDel(true);
          handleClickOpenDel(true);
          break;
        default:
          console.warn(`Unknown action: ${action}`);
      }
    } catch (error) {
      console.error(`Error performing action ${action}:`, error);
      setSnackQ(true);
    }

    setTimeout(() => setSelectedItem(null), 300);
  };

  const [openActivate, setOpenActivate] = useState(false);
  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [openMarkSold, setOpenMarkSold] = useState(false);
  const [openMarkNotSold, setOpenMarkNotSold] = useState(false);
  const [actionProId, setActionProId] = useState(null)

  const handleOpenActivate = () => setOpenActivate(true);
  const handleCloseActivate = () => setOpenActivate(false);

  const handleOpenDeactivate = () => setOpenDeactivate(true);
  const handleCloseDeactivate = () => setOpenDeactivate(false);

  const handleOpenMarkSold = () => setOpenMarkSold(true);
  const handleCloseMarkSold = () => setOpenMarkSold(false);

  const handleOpenMarkNotSold = () => setOpenMarkNotSold(true);
  const handleCloseMarkNotSold = () => setOpenMarkNotSold(false);

  return (
    <div className="dashboard-main-wrapper">
      {/* <TabSection allPropertiesLength={data.length} /> */}

      <DeleteDialog open={openDel}  handleClose={handleCloseDel} deleteProperty={deleteProperty} deleteHeading={"Delete this Property?"} deleteContent={"Are you sure want to delete this, You will not be able to recover it."} />
     {/* Activate Property Dialog */}
     <PropertyStatusDialog
        open={openActivate}
        handleClose={handleCloseActivate}
        onClickFunction={() => listProperty(actionProId)}
        heading="Activate Property"
        content="Are you sure you want to activate this property? It will be visible to everyone."
        actionButtonText="Activate"
        actionButtonClass="action-button"
      />

      {/* Deactivate Property Dialog */}
      <PropertyStatusDialog
        open={openDeactivate}
        handleClose={handleCloseDeactivate}
        onClickFunction={() => delistProperty}
        heading="Deactivate Property"
        content="Are you sure you want to deactivate this property? It will be hidden from everyone."
        actionButtonText="Deactivate"
        actionButtonClass="action-button"
      />

      {/* Mark as Sold Dialog */}
      <PropertyStatusDialog
        open={openMarkSold}
        handleClose={handleCloseMarkSold}
        onClickFunction={() => updateSaleStatus}
        heading="Mark Property as Sold"
        content="Are you sure you want to mark this property as sold?"
        actionButtonText="Mark as Sold"
        actionButtonClass="action-button"
      />

      {/* Mark as Not Sold Dialog */}
      <PropertyStatusDialog
        open={openMarkNotSold}
        handleClose={handleCloseMarkNotSold}
        onClickFunction={() => updateSaleStatus}
        heading="Mark Property as Not Sold"
        content="Are you sure you want to mark this property as not sold?"
        actionButtonText="Mark as Not Sold"
        actionButtonClass="action-button"
      />
      
      <Snackbar
        ContentProps={{
          sx: {
            background: "green",
            color: "white",
          },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackDel}
        autoHideDuration={1000}
        onClose={() => setSnackDel(false)}
        message={"Deleted Successfully"}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delist this property? "}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can relist the property at any time.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={delistProperty} autoFocus>
            Delist
          </Button>
        </DialogActions>
      </Dialog>
      {loader ? <Loader /> : ""}
      <Snackbar
        ContentProps={{
          sx: {
            background: "red",
            color: "white",
            textAlign: "center",
          },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackQ}
        autoHideDuration={1000}
        onClose={() => setSnackQ(false)}
        message={"Property Delisted"}
      />
      <Snackbar
        ContentProps={{
          sx: {
            background: "green",
            color: "white",
            textAlign: "center",
          },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snack}
        autoHideDuration={1000}
        onClose={() => setSnack(false)}
        message={"Property Listed"}
      />
      <TabSection
        allPropertiesLength={filteredData.length}
        onTabChange={(tabLabel) => {
          const filterMap = {
            "All Properties": "All",
            "Listed Properties": "Listed Properties",
            "Delisted/Expired": "Delisted Properties",
            "Sold Out Properties": "All",
          };
          setFilter(filterMap[tabLabel] || "All");
          setCurrentPage(1);
        }}
      />
      <div className="dashboard-main-filters">
        <div className="row">
          <div className="col-md-3">
            <Filter
              filterOptions={propertyTypes}
              value={filter}
              onChange={(value) => {
                setFilter(value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="col-md-9">
            <SearchBar
              value={searchValue}
              onChange={(value) => {
                setSearchValue(value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      <div className="div-table">
        <TableHead theadArray={theadArray} />
        <div className="div-table-body">
          {!dataLoaded ? (
            <SkeletonTable count={recordsPerPage} />
          ) : records.length > 0 ? (
            records.map((item) => (
              <div className="div-table-row" key={item.pro_id}>
                <div className="div-table-cell">{item.pro_modified_id}</div>
                <div className="div-table-cell mobile-hidden-field">
                  {PropertyTypeFunction(item.pro_type)}
                </div>
                <div className="div-table-cell div-table-cell-pro_ad_type mobile-hidden-field">
                  {item.pro_ad_type}
                </div>
                <div className="div-table-cell mobile-hidden-field">
                  {ShowPrice(item.pro_ad_type, item.pro_amt)}
                </div>
                <div className="div-table-cell div-table-cell-date">
                  {DateFormat(item.pro_creation_date)}
                </div>
                <div className="div-table-cell div-table-cell-date">
                  {DateFormat(item.pro_renew_date)}
                </div>
                <div className="div-table-cell div-table-cell-action-btn">
                  <PropertyCurrentStatus val={item.pro_listed} />
                </div>

                <div
                  onClick={() =>
                    setOpenDropdownId(
                      openDropdownId === item.pro_id ? null : item.pro_id
                    )
                  }
                  className="div-table-cell div-table-cell-action-btn action-btn-wrapper"
                >
                  <span className="action-btn">
                    Action{" "}
                    <span>
                      {openDropdownId === item.pro_id ? (
                        <ArrowUp />
                      ) : (
                        <ArrowDown />
                      )}
                    </span>
                  </span>
                  {openDropdownId === item.pro_id && (
                    <ActionBtnDropdown
                      pro_url={item.pro_url}
                      pro_id={item.pro_id}
                      selectedItem={selectedItem}
                      onAction={handleAction}
                    />
                  )}
                </div>

                <div className="div-table-cell">Remarks</div>
              </div>
            ))
          ) : (
            <div className="div-table-row-block">
              <div
                className="div-table-cell"
                style={{
                  gridColumn: "span 9",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                <NoData />
              </div>
            </div>
          )}
        </div>
        {records.length > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={nPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
