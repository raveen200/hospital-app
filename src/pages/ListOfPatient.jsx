import { MoreHorizontal, PlusCircle, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { formatDate } from "../utils/dateUtils.js";

import { useDispatch, useSelector } from "react-redux";

import {
  getPatientsAction,
  deletePatientAction,
  updatePatientAction,
} from "../redux/actions/PatientAction";
import { useCallback, useEffect, useState } from "react";
import PatientAddPopUp from "./PatientAddPopUp";
import PatientDetailPop from "./PatientDetailPop";

export const description =
  "An products dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. It displays a list of products in a table with actions.";

export function ListOfPatient() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditWindow, setIsOpenEditWindow] = useState(false);
  const dispatch = useDispatch();
  const patients = useSelector((state) => state.patientsRedux?.patients || []);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getPatients = useCallback(async () => {
    try {
      await dispatch(getPatientsAction()).unwrap();
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  }, [dispatch]);

  // fetch patients on component mount
  useEffect(() => {
    getPatients();
  }, [getPatients]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deletePatientAction(id)).unwrap();
      await getPatients();
    } catch (error) {
      console.error("Failed to delete the patient:", error);
    }
  };

  const handleEditPatient = async (patient) => {
    setSelectedPatient(patient);
    setIsOpenEditWindow(true);
  };

  const handleStatus = async (patient) => {
    try {
      const data = {
        ...patient,
        status: patient.status === 1 ? 2 : 1,
      };
      await dispatch(updatePatientAction(data)).unwrap();
      await getPatients();
    } catch (error) {
      console.error("Failed to update the patient status:", error);
    }
  };

  const handleEditPatientModalClose = (isSubmitted = true) => {
    console.log("handleEditPatientModalClose", isSubmitted);
    setIsOpenEditWindow(false);
    setSelectedPatient(null);
    if (isSubmitted) {
      getPatients();
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />

                <Button
                  onClick={() => setIsOpen(true)}
                  size="sm"
                  className="h-8 gap-1"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Patient
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Patients</CardTitle>
                  <CardDescription>
                    Manage Hospital Patients and view their Reports.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Mobile Number
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Age
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Update at
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients?.map((patient) => (
                        <TableRow key={patient?.p_ID}>
                          <TableCell className="hidden sm:table-cell">
                            P - {patient?.p_ID}
                          </TableCell>
                          <TableCell className="font-medium">
                            {patient?.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {patient?.status === 1 ? "Active" : "Discharged"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {patient?.phoneNumber}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {patient?.age}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatDate(patient?.updatedOn)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => handleStatus(patient)}
                                >
                                  {patient?.status === 1
                                    ? "Discharge"
                                    : "Active"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditPatient(patient)}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(patient?.p_ID)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  {/* <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                    products
                  </div> */}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <PatientAddPopUp isOpen={isOpen} setIsOpen={setIsOpen} />
      <PatientDetailPop
        isOpenEditWindow={isOpenEditWindow}
        handleModalClose={handleEditPatientModalClose}
        selectedPatient={selectedPatient}
      />
    </div>
  );
}
