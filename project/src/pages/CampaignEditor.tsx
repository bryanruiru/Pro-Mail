import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Send, Save, Image as ImageIcon, Link as LinkIcon, Bold, Italic, List, Users, AlertCircle, Plus, X, Clock } from 'lucide-react';
import LinkEditor from '../components/LinkEditor';
import ImageUploader from '../components/ImageUploader';
import CampaignScheduler from '../components/CampaignScheduler';
import RecipientModal from '../components/MailingListSelector';
import CreateMailingListModal from '../components/CreateMailingListModal';
import { emailService } from '../utils/emailService';
import { campaignStore } from '../stores/campaignStore';
import { mailingListStore } from '../stores/mailingListStore';

const CampaignEditor = () => {
  const { addCampaign } = campaignStore();
  const { lists } = mailingListStore();
  const [campaignData, setCampaignData] = useState({
    subject: '',
    previewText: '',
    fromName: '',
    fromEmail: '',
    selectedList: '',
  });
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [sendProgress, setSendProgress] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        image: {
          HTMLAttributes: {
            class: 'max-w-full rounded-lg',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-400 hover:text-indigo-500 underline',
        },
      }),
    ],
    content: '<p>Start writing your email content here...</p>',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCampaignData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDraft = async () => {
    if (!campaignData.subject) {
      setAlertMessage('Please enter a subject line');
      setShowAlert(true);
      return;
    }

    setIsSaving(true);
    try {
      const saved = await emailService.saveDraft({
        subject: campaignData.subject,
        content: editor?.getHTML() || '',
        recipients: [],
        fromName: campaignData.fromName,
        fromEmail: campaignData.fromEmail,
      });

      if (saved) {
        addCampaign({
          id: Date.now().toString(),
          name: campaignData.subject,
          status: 'draft',
          recipientCount: 0,
          content: editor?.getHTML() || '',
        });
        setAlertMessage('Campaign draft saved successfully');
      } else {
        setAlertMessage('Error saving draft');
      }
      setShowAlert(true);
    } catch (error) {
      setAlertMessage('Error saving draft');
      setShowAlert(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendCampaign = async (scheduleTime: Date | null) => {
    if (!campaignData.subject || !campaignData.selectedList) {
      setAlertMessage('Please fill in all required fields and select a recipient list');
      setShowAlert(true);
      return;
    }

    setIsSending(true);
    setSendProgress(0);

    try {
      const selectedList = lists.find(list => list.id === campaignData.selectedList);
      const recipients = selectedList ? selectedList.subscriberCount : 0;

      if (scheduleTime) {
        // Schedule the campaign
        addCampaign({
          id: Date.now().toString(),
          name: campaignData.subject,
          status: 'scheduled',
          scheduleTime,
          recipientCount: recipients,
          content: editor?.getHTML() || '',
        });
        setAlertMessage(`Campaign scheduled for ${scheduleTime.toLocaleString()}`);
      } else {
        // Send immediately
        const success = await emailService.sendCampaign({
          subject: campaignData.subject,
          content: editor?.getHTML() || '',
          recipients: Array(recipients).fill('recipient@example.com'),
          fromName: campaignData.fromName,
          fromEmail: campaignData.fromEmail,
          onProgress: (progress) => {
            setSendProgress(progress);
          }
        });

        if (success) {
          addCampaign({
            id: Date.now().toString(),
            name: campaignData.subject,
            status: 'sent',
            sentDate: new Date().toISOString(),
            recipientCount: recipients,
            content: editor?.getHTML() || '',
          });
          setAlertMessage('Campaign sent successfully!');
        } else {
          setAlertMessage('Error sending campaign');
        }
      }
    } catch (error) {
      setAlertMessage('Error processing campaign');
    } finally {
      setIsSending(false);
      setSendProgress(0);
      setShowAlert(true);
      setShowScheduler(false);
    }
  };

  const handleLinkSave = (url: string, text: string) => {
    if (editor) {
      if (editor.isActive('link')) {
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      } else {
        if (editor.state.selection.empty) {
          editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
        } else {
          editor.chain().focus().setLink({ href: url }).run();
        }
      }
    }
    setShowLinkEditor(false);
  };

  const handleImageUpload = (imageUrl: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
    setShowImageUploader(false);
  };

  const handleListSelect = (listId: string) => {
    setCampaignData(prev => ({ ...prev, selectedList: listId }));
    setShowRecipientModal(false);
  };

  const handleCreateListSuccess = () => {
    setShowNewListModal(false);
    setAlertMessage('Mailing list created successfully');
    setShowAlert(true);
  };

  const getSelectedListDetails = () => {
    const selectedList = lists.find(l => l.id === campaignData.selectedList);
    return selectedList ? {
      name: selectedList.name,
      count: selectedList.subscriberCount
    } : null;
  };

  return (
    <div className="p-8">
      {/* Alert Component */}
      {showAlert && (
        <div className="fixed top-4 right-4 flex items-center gap-2 rounded-lg bg-gray-800 p-4 text-white shadow-lg">
          <AlertCircle className="h-5 w-5" />
          <p>{alertMessage}</p>
          <button
            onClick={() => setShowAlert(false)}
            className="ml-4 text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Progress Indicator */}
      {isSending && sendProgress > 0 && (
        <div className="fixed bottom-4 right-4 w-64 rounded-lg bg-gray-800 p-4 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-200">Sending campaign...</span>
            <span className="text-sm text-gray-400">{sendProgress}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-700">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${sendProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Campaign Editor</h1>
        <div className="space-x-4">
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="inline-flex items-center rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-100 hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => setShowScheduler(true)}
            disabled={isSending}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Send className="mr-2 h-4 w-4" />
            Send Campaign
          </button>
        </div>
      </div>

      {/* Main Editor Content */}
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <div className="rounded-lg bg-gray-800 p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-medium text-gray-100">Email Content</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Subject Line
                </label>
                <input
                  type="text"
                  name="subject"
                  value={campaignData.subject}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter subject line"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Preview Text
                </label>
                <input
                  type="text"
                  name="previewText"
                  value={campaignData.previewText}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter preview text"
                />
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="mb-4 flex space-x-2">
                  <button
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`rounded p-2 hover:bg-gray-700 ${
                      editor?.isActive('bold') ? 'bg-gray-700' : ''
                    }`}
                  >
                    <Bold className="h-5 w-5 text-gray-200" />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`rounded p-2 hover:bg-gray-700 ${
                      editor?.isActive('italic') ? 'bg-gray-700' : ''
                    }`}
                  >
                    <Italic className="h-5 w-5 text-gray-200" />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`rounded p-2 hover:bg-gray-700 ${
                      editor?.isActive('bulletList') ? 'bg-gray-700' : ''
                    }`}
                  >
                    <List className="h-5 w-5 text-gray-200" />
                  </button>
                  <button
                    onClick={() => setShowLinkEditor(true)}
                    className={`rounded p-2 hover:bg-gray-700 ${
                      editor?.isActive('link') ? 'bg-gray-700' : ''
                    }`}
                  >
                    <LinkIcon className="h-5 w-5 text-gray-200" />
                  </button>
                  <button
                    onClick={() => setShowImageUploader(true)}
                    className="rounded p-2 hover:bg-gray-700"
                  >
                    <ImageIcon className="h-5 w-5 text-gray-200" />
                  </button>
                </div>
                <EditorContent
                  editor={editor}
                  className="prose prose-invert min-h-[400px] max-w-none rounded-lg border border-gray-700 bg-gray-900 p-4 text-gray-100 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-gray-800 p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-medium text-gray-100">Sender Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  From Name
                </label>
                <input
                  type="text"
                  name="fromName"
                  value={campaignData.fromName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter sender name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  From Email
                </label>
                <input
                  type="email"
                  name="fromEmail"
                  value={campaignData.fromEmail}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter sender email"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-800 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-100">Recipients</h2>
              <button
                onClick={() => setShowNewListModal(true)}
                className="inline-flex items-center rounded-lg bg-gray-700 px-3 py-1 text-sm font-medium text-gray-200 hover:bg-gray-600"
              >
                <Plus className="mr-1 h-4 w-4" />
                New List
              </button>
            </div>
            
            {campaignData.selectedList ? (
              <div className="mb-4">
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        {getSelectedListDetails()?.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {getSelectedListDetails()?.count} subscribers
                      </p>
                    </div>
                    <button
                      onClick={() => setShowRecipientModal(true)}
                      className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowRecipientModal(true)}
                className="w-full rounded-lg border-2 border-dashed border-gray-700 p-4 text-center text-sm text-gray-400 hover:border-gray-600 hover:text-gray-300"
              >
                <Users className="mx-auto mb-2 h-6 w-6" />
                Choose recipient list
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Link Editor Modal */}
      {showLinkEditor && (
        <LinkEditor
          onSave={handleLinkSave}
          onClose={() => setShowLinkEditor(false)}
          initialUrl={editor?.getAttributes('link').href}
          initialText={editor?.state.selection.empty ? '' : editor?.state.selection.content().content.firstChild?.text || ''}
        />
      )}

      {/* Image Uploader Modal */}
      {showImageUploader && (
        <ImageUploader
          onUpload={handleImageUpload}
          onClose={() => setShowImageUploader(false)}
        />
      )}

      {/* Campaign Scheduler Modal */}
      {showScheduler && (
        <CampaignScheduler
          onSchedule={handleSendCampaign}
          onClose={() => setShowScheduler(false)}
        />
      )}

      {/* Recipient List Modal */}
      {showRecipientModal && (
        <RecipientModal
          onClose={() => setShowRecipientModal(false)}
          onSelect={handleListSelect}
        />
      )}

      {/* New List Modal */}
      {showNewListModal && (
        <CreateMailingListModal
          onClose={() => setShowNewListModal(false)}
          onSuccess={handleCreateListSuccess}
        />
      )}
    </div>
  );
};

export default CampaignEditor;