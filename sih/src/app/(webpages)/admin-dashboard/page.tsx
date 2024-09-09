"use client"
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, Clock, AlertTriangle, BarChart2, Bell, Filter, LogOut, Menu, MessageCircle, Send } from "lucide-react"

type Severity = 'high' | 'medium' | 'low';
type Status = 'Open' | 'In Progress' | 'Resolved';
type DateFilter = 'today' | 'thisWeek' | 'thisMonth';

interface Complaint {
  id: string
  text: string
  severity: Severity
  status: Status
  date: string
}

interface FilterState {
  severity: {
    high: boolean;
    medium: boolean;
    low: boolean;
  };
  status: {
    Open: boolean;
    'In Progress': boolean;
    Resolved: boolean;
  };
  date: {
    today: boolean;
    thisWeek: boolean;
    thisMonth: boolean;
  };
}

interface Message {
  role: 'bot' | 'user'
  content: string
}

const jsonData: Complaint[] = [
  { id: "CMP006", text: "Delayed train on Route 10", severity: "medium", status: "Resolved", date: "2023-05-16" },
        { id: "CMP007", text: "Unclean compartment in Express 5", severity: "low", status: "Open", date: "2023-05-15" },
        { id: "CMP008", text: "Faulty AC in second class cabin", severity: "high", status: "In Progress", date: "2023-05-14" },
        { id: "CMP009", text: "Rude behavior from train attendant", severity: "medium", status: "Resolved", date: "2023-05-13" },
        { id: "CMP010", text: "Missing luggage report for flight 234", severity: "high", status: "Open", date: "2023-05-12" },
        { id: "CMP011", text: "Delayed train on Route 3", severity: "low", status: "In Progress", date: "2023-05-17" },
        { id: "CMP012", text: "Unclean compartment in Express 2", severity: "high", status: "Resolved", date: "2023-05-16" },
        { id: "CMP013", text: "Faulty AC in third class cabin", severity: "medium", status: "Open", date: "2023-05-15" },
        { id: "CMP014", text: "Rude behavior from platform staff", severity: "low", status: "In Progress", date: "2023-05-14" },
        { id: "CMP015", text: "Missing luggage report for bus 456", severity: "high", status: "Resolved", date: "2023-05-13" },
        { id: "CMP016", text: "Delayed train on Route 8", severity: "medium", status: "Open", date: "2023-05-18" },
        { id: "CMP017", text: "Unclean compartment in Express 1", severity: "low", status: "In Progress", date: "2023-05-17" },
        { id: "CMP018", text: "Faulty AC in sleeper class cabin", severity: "high", status: "Resolved", date: "2023-05-16" },
        { id: "CMP019", text: "Rude behavior from station staff", severity: "medium", status: "Open", date: "2023-05-15" },
        { id: "CMP020", text: "Missing luggage report for flight 789", severity: "low", status: "In Progress", date: "2023-05-14" },
        { id: "CMP021", text: "Delayed train on Route 12", severity: "high", status: "Resolved", date: "2023-05-19" },
        { id: "CMP022", text: "Unclean compartment in Express 4", severity: "medium", status: "Open", date: "2023-05-18" },
        { id: "CMP023", text: "Faulty AC in business class cabin", severity: "low", status: "In Progress", date: "2023-05-17" },
        { id: "CMP024", text: "Rude behavior from train driver", severity: "high", status: "Resolved", date: "2023-05-16" },
        { id: "CMP025", text: "Missing luggage report for bus 123", severity: "medium", status: "Open", date: "2023-05-15" },
        { id: "CMP026", text: "Delayed train on Route 9", severity: "low", status: "In Progress", date: "2023-05-20" },
        { id: "CMP027", text: "Unclean compartment in Express 3", severity: "high", status: "Resolved", date: "2023-05-19" },
        { id: "CMP028", text: "Faulty AC in economy class cabin", severity: "medium", status: "Open", date: "2023-05-18" },
        { id: "CMP029", text: "Rude behavior from ticket inspector", severity: "low", status: "In Progress", date: "2023-05-17" },
        { id: "CMP030", text: "Missing luggage report for flight 567", severity: "high", status: "Resolved", date: "2023-05-16" },
        { id: "CMP031", text: "Delayed train on Route 11", severity: "medium", status: "Open", date: "2023-05-21" },
        { id: "CMP032", text: "Unclean compartment in Express 6", severity: "low", status: "In Progress", date: "2023-05-20" },
        { id: "CMP033", text: "Faulty AC in premium class cabin", severity: "high", status: "Resolved", date: "2023-05-19" },
        { id: "CMP034", text: "Rude behavior from station announcer", severity: "medium", status: "Open", date: "2023-05-18" },
        { id: "CMP035", text: "Missing luggage report for bus 890", severity: "low", status: "In Progress", date: "2023-05-17" },
        { id: "CMP036", text: "Delayed train on Route 7", severity: "high", status: "Resolved", date: "2023-05-22" },
        { id: "CMP037", text: "Unclean compartment in Express 8", severity: "medium", status: "Open", date: "2023-05-21" },
        { id: "CMP038", text: "Faulty AC in VIP class cabin", severity: "low", status: "In Progress", date: "2023-05-20" },
        { id: "CMP039", text: "Rude behavior from platform inspector", severity: "high", status: "Resolved", date: "2023-05-19" },
        { id: "CMP040", text: "Missing luggage report for flight 123", severity: "medium", status: "Open", date: "2023-05-18" }
];

export default function Component() {
  const [chatbotOpen, setChatbotOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hello! How can I assist you today?' }
  ])
  const [inputMessage, setInputMessage] = useState('')

  const adminDetails = {
    name: "John Doe",
    role: "Senior Complaint Manager",
    complaintsResolved: 152,
    resolutionRate: "95%",
    averageResponseTime: "2.5 hours",
  }

  const [complaints, setComplaints] = useState<Complaint[]>(jsonData)
  const [filters, setFilters] = useState<FilterState>({
    severity: { high: false, medium: false, low: false },
    status: { Open: false, "In Progress": false, Resolved: false },
    date: { today: false, thisWeek: false, thisMonth: false }
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500 hover:bg-red-600'
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600'
      case 'low':
        return 'bg-green-500 hover:bg-green-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const handleFilterChange = (category: keyof FilterState, item: string) => {
    setFilters(prevFilters => {
      if (category === 'severity' && (item === 'high' || item === 'medium' || item === 'low')) {
        return {
          ...prevFilters,
          severity: {
            ...prevFilters.severity,
            [item]: !prevFilters.severity[item as keyof FilterState['severity']],
          },
        };
      } else if (category === 'status' && (item === 'Open' || item === 'In Progress' || item === 'Resolved')) {
        return {
          ...prevFilters,
          status: {
            ...prevFilters.status,
            [item]: !prevFilters.status[item as keyof FilterState['status']],
          },
        };
      } else if (category === 'date' && (item === 'today' || item === 'thisWeek' || item === 'thisMonth')) {
        return {
          ...prevFilters,
          date: {
            ...prevFilters.date,
            [item]: !prevFilters.date[item as keyof FilterState['date']],
          },
        };
      }
      return prevFilters;
    });
  }

  const filteredComplaints = complaints
    .filter(complaint => {
      if (Object.values(filters.severity).every(v => !v)) return true
      return filters.severity[complaint.severity]
    })
    .filter(complaint => {
      if (Object.values(filters.status).every(v => !v)) return true
      return filters.status[complaint.status]
    })
    .filter(complaint => {
      if (Object.values(filters.date).every(v => !v)) return true
      const complaintDate = new Date(complaint.date)
      const today = new Date()
      if (filters.date.today && complaintDate.toDateString() === today.toDateString()) return true
      if (filters.date.thisWeek && complaintDate >= new Date(today.setDate(today.getDate() - 7))) return true
      if (filters.date.thisMonth && complaintDate.getMonth() === today.getMonth() && complaintDate.getFullYear() === today.getFullYear()) return true
      return false
    })
    .sort((a, b) => {
      if (a.status === 'Resolved' && b.status !== 'Resolved') return 1
      if (a.status !== 'Resolved' && b.status === 'Resolved') return -1
      return 0
    })

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setChatMessages([...chatMessages, { role: 'user', content: inputMessage }])
      setInputMessage('')
      // Simulate bot response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: 'bot', content: "I'm sorry, I'm just a demo bot. I can't actually process your request." }])
      }, 1000)
    }
  }

  const Sidebar = ({ className = "" }) => (
    <aside className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-y-auto ${className}`}>
      <div className="space-y-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="text-green-500" />
              <span className="text-sm font-medium">Resolved: {adminDetails.complaintsResolved}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart2 className="text-blue-500" />
              <span className="text-sm font-medium">Resolution Rate: {adminDetails.resolutionRate}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="text-yellow-500" />
              <span className="text-sm font-medium">Avg. Response: {adminDetails.averageResponseTime}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <h3 className="font-semibold mb-4 flex items-center text-lg">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </h3>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="severity">
            <AccordionTrigger>Severity</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {Object.entries(filters.severity).map(([severity, isChecked]) => (
                  <div key={severity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`severity-${severity}`}
                      checked={isChecked}
                      onCheckedChange={() => handleFilterChange('severity', severity)}
                    />
                    <Label htmlFor={`severity-${severity}`} className="flex items-center">
                      <Badge className={`${getSeverityColor(severity)} text-white mr-2`}>
                        {severity}
                      </Badge>
                      {severity.charAt(0).toUpperCase() + severity.slice(1)}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="status">
            <AccordionTrigger>Status</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {Object.entries(filters.status).map(([status, isChecked]) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={isChecked}
                      onCheckedChange={() => handleFilterChange('status', status)}
                    />
                    <Label htmlFor={`status-${status}`}>{status}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="date">
            <AccordionTrigger>Date</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {Object.entries(filters.date).map(([dateFilter, isChecked]) => (
                  <div key={dateFilter} className="flex items-center space-x-2">
                    <Checkbox
                      id={`date-${dateFilter}`}
                      checked={isChecked}
                      onCheckedChange={() => handleFilterChange('date', dateFilter)}
                    />
                    <Label htmlFor={`date-${dateFilter}`}>
                      {dateFilter === 'today' ? 'Today' :
                        dateFilter === 'thisWeek' ? 'This Week' :
                        'This Month'}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  )

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 p-4 space-y-4">
      {/* <nav className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 max-[1000px]:inline-flex hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <Sidebar />
              </SheetContent>
            </Sheet>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">RAIL MADAD</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium hidden sm:inline">{adminDetails.name}</span>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt={adminDetails.name} />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav> */}
      <div className="flex flex-1 space-x-4 overflow-hidden">
        <Sidebar className="w-80 min-[1000px]:block hidden flex-shrink-0" />
        <main className="flex-1 overflow-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Complaint Dashboard</h1>
            <Button size="icon" variant="outline">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
          <Card className="shadow-lg overflow-hidden">
  <CardHeader className="bg-gray-50 dark:bg-gray-800">
    <CardTitle className="text-xl">Recent Complaints</CardTitle>
  </CardHeader>
  <CardContent className="p-0">
    {/* Separate Table for Header */}
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Complaint</TableHead>
          <TableHead className="w-[100px]">Severity</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead className="w-[100px]">Action</TableHead>
        </TableRow>
      </TableHeader>
    </Table>
    {/* Scrollable Table Body */}
    <div style={{ maxHeight: '72vh', overflowY: 'auto' }}>
      <Table>
        <TableBody>
          {filteredComplaints.map((complaint) => (
            <TableRow key={complaint.id}>
              <TableCell className="font-medium">{complaint.id}</TableCell>
              <TableCell>{complaint.text}</TableCell>
              <TableCell>
                <Badge className={`${getSeverityColor(complaint.severity)} text-white`}>
                  {complaint.severity}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{complaint.status}</Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">{complaint.date}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline">View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </CardContent>
</Card>


        </main>
      </div>
      <Button
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg"
        onClick={() => setChatbotOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      <Dialog open={chatbotOpen} onOpenChange={setChatbotOpen}>
        <DialogContent
          className="sm:max-w-[425px] fixed bottom-4 right-4 w-full sm:w-auto"
          style={{ transform: 'none' }}
        >
          <DialogHeader>
            <DialogTitle>Chat Support</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-4">
            {chatMessages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {message.content}
                </div>
              </div>
            ))}
          </ScrollArea>
          <DialogFooter>
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button type="submit" size="icon" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
