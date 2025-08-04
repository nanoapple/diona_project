import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  Video, 
  Music, 
  Book, 
  Plus, 
  Search,
  BookOpen,
  Archive
} from "lucide-react";

const Knowledge = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  // Mock data for demonstration
  const documents = [
    { id: 1, name: "Legal Research Notes.pdf", type: "document", category: "Legal", date: "2024-01-15" },
    { id: 2, name: "Psychology Principles.docx", type: "document", category: "Psychology", date: "2024-01-10" },
  ];

  const videos = [
    { id: 1, name: "Therapy Techniques.mp4", type: "video", category: "Training", date: "2024-01-12" },
  ];

  const audio = [
    { id: 1, name: "Mindfulness Session.mp3", type: "audio", category: "Wellness", date: "2024-01-08" },
  ];

  const notes = [
    { id: 1, title: "Client Interview Tips", content: "Key strategies for conducting effective client interviews...", date: "2024-01-14" },
    { id: 2, title: "Case Study Observations", content: "Important observations from recent case studies...", date: "2024-01-11" },
  ];

  const handleFileUpload = (type: string) => {
    // This would handle file upload logic
    console.log(`Uploading ${type} file`);
  };

  const handleAddNote = () => {
    if (newNote.title && newNote.content) {
      // This would save the note to the knowledge base
      console.log("Adding note:", newNote);
      setNewNote({ title: "", content: "" });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Knowledge Base</h1>
            <p className="text-muted-foreground">
              Store and organize your documents, media, and personal notes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Audio
            </TabsTrigger>
            <TabsTrigger value="books" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              Books
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Documents</h2>
              <Button onClick={() => handleFileUpload('document')} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Document
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {doc.name}
                    </CardTitle>
                    <CardDescription>{doc.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{doc.category}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Videos</h2>
              <Button onClick={() => handleFileUpload('video')} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Video
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <Card key={video.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      {video.name}
                    </CardTitle>
                    <CardDescription>{video.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{video.category}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audio" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Audio Files</h2>
              <Button onClick={() => handleFileUpload('audio')} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Audio
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {audio.map((file) => (
                <Card key={file.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Music className="h-4 w-4" />
                      {file.name}
                    </CardTitle>
                    <CardDescription>{file.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{file.category}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="books" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Books</h2>
              <Button onClick={() => handleFileUpload('book')} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Book
              </Button>
            </div>
            <div className="text-center py-12">
              <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No books uploaded yet. Start building your digital library!</p>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Personal Notes</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Note
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Note</DialogTitle>
                    <DialogDescription>
                      Add your personal notes and observations to the knowledge base.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Note title"
                      value={newNote.title}
                      onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Write your note content here..."
                      value={newNote.content}
                      onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                      rows={6}
                    />
                    <Button onClick={handleAddNote} className="w-full">
                      Save Note
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-4">
              {notes.map((note) => (
                <Card key={note.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <CardDescription>{note.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">{note.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Knowledge;