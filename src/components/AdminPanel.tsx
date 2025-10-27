import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, Download } from "lucide-react";

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: string;
}

const AdminPanel = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    // Load submissions from localStorage
    const storedSubmissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    setSubmissions(storedSubmissions);
  }, []);

  const deleteSubmission = (id: number) => {
    const updatedSubmissions = submissions.filter(sub => sub.id !== id);
    setSubmissions(updatedSubmissions);
    localStorage.setItem('contactSubmissions', JSON.stringify(updatedSubmissions));
  };

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Name', 'Email', 'Phone', 'Message', 'Timestamp'],
      ...submissions.map(sub => [
        sub.id,
        sub.name,
        sub.email,
        sub.phone,
        `"${sub.message.replace(/"/g, '""')}"`, // Escape quotes in message
        sub.timestamp
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contact-submissions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Contact Form Submissions</h1>
          <Button onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submissions List */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Submissions ({submissions.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {submissions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No submissions yet
                  </p>
                ) : (
                  submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{submission.name}</h3>
                          <Badge variant="secondary">
                            {new Date(submission.timestamp).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{submission.email}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {submission.message.substring(0, 50)}...
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubmission(submission);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSubmission(submission.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Submission Details */}
          <div>
            {selectedSubmission ? (
              <Card>
                <CardHeader>
                  <CardTitle>Submission Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-lg">{selectedSubmission.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-lg">{selectedSubmission.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-lg">{selectedSubmission.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Message</label>
                    <p className="text-lg whitespace-pre-wrap">{selectedSubmission.message}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Submitted At</label>
                    <p className="text-lg">
                      {new Date(selectedSubmission.timestamp).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">Select a submission to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
