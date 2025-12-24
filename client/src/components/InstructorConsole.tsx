import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Users,
  Clock,
  MessageSquare,
  Video,
  Upload,
  Link as LinkIcon,
  Play,
  Square,
  FileVideo,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Session {
  id: string;
  title: string;
  startsAt: string;
  durationMin: number;
  enrolledCount: number;
}

interface SessionSettings {
  chatEnabled: boolean;
  recording: boolean;
}

export default function InstructorConsole() {
  // todo: remove mock functionality
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sessionSettings, setSessionSettings] = useState<SessionSettings>({
    chatEnabled: false,
    recording: false
  });
  const [uploadUrl, setUploadUrl] = useState('');
  const [recordingUrl, setRecordingUrl] = useState('');
  const [isLive, setIsLive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // todo: remove mock functionality - simulate sessions data
    setSessions([
      { id: '1', title: 'Mathematics - Algebra Basics', startsAt: '2025-01-15T10:00:00Z', durationMin: 60, enrolledCount: 12 },
      { id: '2', title: 'Science - Biology Lab', startsAt: '2025-01-16T14:00:00Z', durationMin: 45, enrolledCount: 8 },
      { id: '3', title: 'History - World War II', startsAt: '2025-01-17T11:00:00Z', durationMin: 60, enrolledCount: 15 },
      { id: '4', title: 'English - Creative Writing', startsAt: '2025-01-18T09:00:00Z', durationMin: 50, enrolledCount: 10 }
    ]);
    
    // Auto-select first session
    if (sessions.length > 0) {
      setSelectedSession(sessions[0]);
    }
  }, []);

  useEffect(() => {
    if (sessions.length > 0 && !selectedSession) {
      setSelectedSession(sessions[0]);
    }
  }, [sessions, selectedSession]);

  const handleSessionSelect = (session: Session) => {
    setSelectedSession(session);
    console.log('Selected session:', session.id);
    
    // Reset settings for new session
    setSessionSettings({ chatEnabled: false, recording: false });
    setUploadUrl('');
    setRecordingUrl('');
    setIsLive(false);
  };

  const handleToggleChat = (enabled: boolean) => {
    setSessionSettings(prev => ({ ...prev, chatEnabled: enabled }));
    console.log('Chat toggled:', enabled);
    toast({
      title: enabled ? "Chat Enabled" : "Chat Disabled",
      description: `Chat is now ${enabled ? 'available' : 'disabled'} for students in this session.`,
    });
  };

  const handleToggleRecording = (enabled: boolean) => {
    setSessionSettings(prev => ({ ...prev, recording: enabled }));
    console.log('Recording toggled:', enabled);
    toast({
      title: enabled ? "Recording Started" : "Recording Stopped", 
      description: `Session recording is now ${enabled ? 'active' : 'stopped'}.`,
    });
  };

  const handleGetUploadUrl = async () => {
    console.log('Getting presigned upload URL for session:', selectedSession?.id);
    
    // Simulate getting presigned URL
    setTimeout(() => {
      const mockUrl = `https://example-bucket.s3.amazonaws.com/recordings/${selectedSession?.id}/upload?signature=mock123`;
      setUploadUrl(mockUrl);
      toast({
        title: "Upload URL Generated",
        description: "Use this URL to upload your recording file via PUT request.",
      });
    }, 500);
  };

  const handleAttachRecording = async () => {
    if (!recordingUrl.trim()) return;
    
    console.log('Attaching recording URL:', recordingUrl, 'to session:', selectedSession?.id);
    
    toast({
      title: "Recording Attached",
      description: "Recording URL has been saved and will be available in the Parent Portal.",
    });
    
    // Clear the input
    setRecordingUrl('');
  };

  const handleStartClass = () => {
    setIsLive(true);
    console.log('Starting live class for session:', selectedSession?.id);
    toast({
      title: "Class Started",
      description: "Students can now join the live session.",
    });
  };

  const handleEndClass = () => {
    setIsLive(false);
    console.log('Ending live class for session:', selectedSession?.id);
    toast({
      title: "Class Ended",
      description: "The live session has been terminated.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-title">Instructor Console</h1>
        <p className="text-muted-foreground">Manage your sessions, moderate discussions, and handle recordings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions List */}
        <Card data-testid="card-sessions-list">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => handleSessionSelect(session)}
                  className={`p-3 rounded-lg border cursor-pointer hover-elevate transition-all ${
                    selectedSession?.id === session.id ? 'ring-2 ring-primary' : ''
                  }`}
                  data-testid={`session-card-${session.id}`}
                >
                  <div className="space-y-1">
                    <p className="font-medium text-sm" data-testid={`text-session-title-${session.id}`}>
                      {session.title}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(session.startsAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        <span>{session.enrolledCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Session Controls */}
        <Card data-testid="card-session-controls">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Session Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedSession ? (
              <>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium text-sm" data-testid="text-selected-session">
                    {selectedSession.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(selectedSession.startsAt).toLocaleString()} • {selectedSession.durationMin} min
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="chat-toggle" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Enable Chat
                    </Label>
                    <Switch
                      id="chat-toggle"
                      checked={sessionSettings.chatEnabled}
                      onCheckedChange={handleToggleChat}
                      data-testid="switch-chat"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="recording-toggle" className="flex items-center gap-2">
                      <FileVideo className="w-4 h-4" />
                      Recording
                    </Label>
                    <Switch
                      id="recording-toggle"
                      checked={sessionSettings.recording}
                      onCheckedChange={handleToggleRecording}
                      data-testid="switch-recording"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  {!isLive ? (
                    <Button 
                      onClick={handleStartClass} 
                      className="w-full"
                      data-testid="button-start-class"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Class
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleEndClass} 
                      variant="destructive"
                      className="w-full"
                      data-testid="button-end-class"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      End Class
                    </Button>
                  )}
                  
                  {isLive && (
                    <Badge className="w-full justify-center bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" data-testid="badge-live">
                      🔴 LIVE
                    </Badge>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center" data-testid="text-no-selection">
                Select a session to view controls
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recording Management */}
        <Card data-testid="card-recording-management">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Recording Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedSession ? (
              <>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Presigned Upload</Label>
                  <Button 
                    onClick={handleGetUploadUrl} 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    data-testid="button-get-upload-url"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Get Upload URL
                  </Button>
                  
                  {uploadUrl && (
                    <div className="mt-2">
                      <Label className="text-xs text-muted-foreground">Upload URL:</Label>
                      <Textarea
                        value={uploadUrl}
                        readOnly
                        className="text-xs mt-1 font-mono"
                        rows={3}
                        data-testid="textarea-upload-url"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Use PUT request to upload your recording file to this URL.
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <Label htmlFor="recording-url" className="text-sm font-medium mb-2 block">
                    Attach Recording URL
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id="recording-url"
                      placeholder="https://your-storage.com/recording.mp4"
                      value={recordingUrl}
                      onChange={e => setRecordingUrl(e.target.value)}
                      data-testid="input-recording-url"
                    />
                    <Button 
                      onClick={handleAttachRecording}
                      disabled={!recordingUrl.trim()}
                      size="sm"
                      className="w-full"
                      data-testid="button-attach-recording"
                    >
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Attach Recording
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Recording will appear in the Parent Portal after attachment.
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center" data-testid="text-no-session-selected">
                Select a session to manage recordings
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}