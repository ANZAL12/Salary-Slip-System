'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Search, Plus, MoreHorizontal, Mail, CheckCircle2, 
  Trash2, Copy, FileEdit, Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SiToyota } from 'react-icons/si';

import { 
  EmailTemplate, getTemplates, createTemplate, updateTemplate, deleteTemplate, setDefaultTemplate 
} from '@/services/email-template.service';

import 'react-quill-new/dist/quill.snow.css';
// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const PLACEHOLDERS = [
  '{{employee_name}}',
  '{{employee_id}}',
  '{{designation}}',
  '{{month}}',
  '{{year}}',
  '{{net_salary}}',
  '{{company_name}}',
  '{{department}}'
];

const MOCK_DATA: Record<string, string> = {
  '{{employee_name}}': 'John Doe',
  '{{employee_id}}': 'EMP001',
  '{{designation}}': 'Software Engineer',
  '{{month}}': 'May',
  '{{year}}': '2026',
  '{{net_salary}}': '₹49,950',
  '{{company_name}}': 'Nippon Toyota',
  '{{department}}': 'IT Department'
};

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Editor State
  const [activeTemplate, setActiveTemplate] = useState<Partial<EmailTemplate> | null>(null);
  const [activeTab, setActiveTab] = useState<'Editor' | 'Preview'>('Editor');
  
  // Dropdown states
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  
  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    setLoading(true);
    const { data } = await getTemplates();
    if (data) {
      setTemplates(data);
      if (data.length > 0 && !activeTemplate) {
        setActiveTemplate(data[0]);
      }
    }
    setLoading(false);
  }

  const handleCreateNew = () => {
    setActiveTemplate({
      name: 'New Template',
      subject: 'Salary Slip - {{month}} {{year}}',
      description: 'Custom email template.',
      body_html: '<p>Dear {{employee_name}},</p><p><br></p><p>Your salary slip for {{month}} {{year}} has been generated successfully.</p>',
      body_text: '',
      is_default: false
    });
    setActiveTab('Editor');
  };

  const handleSave = async (andUpdateDefault = false) => {
    if (!activeTemplate?.name || !activeTemplate?.subject) {
      toast.error('Name and Subject are required');
      return;
    }

    try {
      const dataToSave = { ...activeTemplate };
      if (andUpdateDefault) {
        dataToSave.is_default = true;
      }

      if (dataToSave.id) {
        // Update
        const { error, data } = await updateTemplate(dataToSave.id, dataToSave);
        if (error) throw new Error(error);
        toast.success(andUpdateDefault ? 'Default template updated!' : 'Template updated successfully!');
        if (data) setActiveTemplate(data);
      } else {
        // Create
        const { error, data } = await createTemplate(dataToSave);
        if (error) throw new Error(error);
        toast.success('Template created successfully!');
        if (data) setActiveTemplate(data);
      }
      
      loadTemplates();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save template');
    }
  };

  const handleDuplicate = async (tpl: EmailTemplate) => {
    try {
      const { id, created_at, updated_at, is_default, ...rest } = tpl;
      const { error } = await createTemplate({
        ...rest,
        name: `${rest.name} (Copy)`,
        is_default: false
      });
      if (error) throw new Error(error);
      toast.success('Template duplicated');
      loadTemplates();
      setMenuOpenId(null);
    } catch (err: any) {
      toast.error('Failed to duplicate');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        const { error } = await deleteTemplate(id);
        if (error) throw new Error(error);
        toast.success('Template deleted');
        if (activeTemplate?.id === id) setActiveTemplate(null);
        loadTemplates();
      } catch (err: any) {
        toast.error('Failed to delete');
      }
    }
    setMenuOpenId(null);
  };

  const handleSetDefault = async (id: string) => {
    try {
      const { error, data } = await setDefaultTemplate(id);
      if (error) throw new Error(error);
      toast.success('Default template updated');
      loadTemplates();
      if (activeTemplate?.id === id && data) {
        setActiveTemplate(data);
      }
    } catch (err: any) {
      toast.error('Failed to set default');
    }
    setMenuOpenId(null);
  };

  const insertPlaceholder = (ph: string) => {
    if (!activeTemplate) return;
    setActiveTemplate(prev => ({
      ...prev,
      body_html: (prev?.body_html || '') + ph
    }));
  };

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (t.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Parse HTML and replace placeholders for preview
  const generatePreviewHtml = (html: string) => {
    if (!html) return '';
    let preview = html;
    PLACEHOLDERS.forEach(ph => {
      // Create global regex for replacement
      const regex = new RegExp(ph.replace(/[{}]/g, '\\$&'), 'g');
      preview = preview.replace(regex, `<span class="font-bold text-gray-900">${MOCK_DATA[ph]}</span>`);
    });
    return preview;
  };

  const generatePreviewSubject = (subject: string) => {
    if (!subject) return '';
    let preview = subject;
    PLACEHOLDERS.forEach(ph => {
      const regex = new RegExp(ph.replace(/[{}]/g, '\\$&'), 'g');
      preview = preview.replace(regex, MOCK_DATA[ph]);
    });
    return preview;
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row gap-4 lg:gap-6 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto overflow-hidden">
      
      {/* LEFT PANEL - Template List */}
      <div className="w-full md:w-[280px] lg:w-[320px] flex-shrink-0 flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Templates</h2>
          
          <div className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-toyota-red/20 focus:border-toyota-red transition-all"
              />
            </div>
            <button 
              onClick={handleCreateNew}
              className="flex items-center justify-center bg-[#EB0A1E] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1" /> New
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {loading ? (
            <p className="text-center text-sm text-gray-500 py-8">Loading templates...</p>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-10 px-4">
              <Mail className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900">No templates found</p>
              <p className="text-xs text-gray-500 mt-1">Create your first email template to get started.</p>
            </div>
          ) : (
            filteredTemplates.map((tpl) => (
              <div 
                key={tpl.id}
                onClick={() => setActiveTemplate(tpl)}
                className={`relative group p-4 rounded-xl border transition-all cursor-pointer ${
                  activeTemplate?.id === tpl.id 
                    ? 'border-toyota-red bg-red-50/10 shadow-sm' 
                    : 'border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${activeTemplate?.id === tpl.id ? 'bg-red-100 text-toyota-red' : 'bg-gray-100 text-gray-500'}`}>
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        {tpl.name}
                        {tpl.is_default && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">Default</span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{tpl.description || 'No description'}</p>
                      <p className="text-[10px] text-gray-400 mt-2 font-medium">
                        Last updated: {new Date(tpl.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Context Menu Button */}
                  <div className="relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === tpl.id ? null : tpl.id); }}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {menuOpenId === tpl.id && (
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-1 overflow-hidden" onClick={e => e.stopPropagation()}>
                        <button onClick={() => { setActiveTemplate(tpl); setMenuOpenId(null); }} className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <FileEdit className="w-3.5 h-3.5 text-gray-400" /> Edit
                        </button>
                        <button onClick={() => handleDuplicate(tpl)} className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Copy className="w-3.5 h-3.5 text-gray-400" /> Duplicate
                        </button>
                        {!tpl.is_default && (
                          <button onClick={() => handleSetDefault(tpl.id)} className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" /> Set As Default
                          </button>
                        )}
                        <div className="h-px bg-gray-100 my-1"></div>
                        <button onClick={() => handleDelete(tpl.id)} className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <Trash2 className="w-3.5 h-3.5 text-red-500" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 text-center font-medium">
          Showing {filteredTemplates.length} templates
        </div>
      </div>

      {/* CENTER & RIGHT PANELS */}
      {activeTemplate ? (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 h-full min-h-0 overflow-hidden">
          
          {/* CENTER PANEL - Editor */}
          <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
            {/* Header Tabs & Actions */}
            <div className="flex items-center justify-between px-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex space-x-6">
                <button 
                  onClick={() => setActiveTab('Editor')}
                  className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Editor' ? 'border-[#EB0A1E] text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  Editor
                </button>
                <button 
                  onClick={() => setActiveTab('Preview')}
                  className={`py-4 text-sm font-bold border-b-2 transition-colors lg:hidden ${activeTab === 'Preview' ? 'border-[#EB0A1E] text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  Preview
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative group hidden sm:block">
                  <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    Insert Placeholder <span className="text-[10px]">▼</span>
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 shadow-xl rounded-lg py-1 z-50 hidden group-hover:block">
                    {PLACEHOLDERS.map(ph => (
                      <button 
                        key={ph} 
                        onClick={() => insertPlaceholder(ph)}
                        className="w-full text-left px-4 py-1.5 text-xs font-mono text-gray-600 hover:bg-gray-50 hover:text-toyota-red"
                      >
                        {ph}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleSave(false)}
                  className="px-4 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Save
                </button>
                <button 
                  onClick={() => handleSave(true)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#EB0A1E] border border-transparent rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  Save & Update
                </button>
              </div>
            </div>

            {/* Editor Form */}
            {(activeTab === 'Editor' || window.innerWidth >= 1024) && (
              <div className={`flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5 ${activeTab !== 'Editor' && 'hidden lg:block'}`}>
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Template Name</label>
                  <input 
                    type="text" 
                    value={activeTemplate.name || ''}
                    onChange={e => setActiveTemplate({...activeTemplate, name: e.target.value})}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-toyota-red/20 focus:border-toyota-red transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Description</label>
                  <input 
                    type="text" 
                    value={activeTemplate.description || ''}
                    onChange={e => setActiveTemplate({...activeTemplate, description: e.target.value})}
                    placeholder="E.g. Email sent to employees with their salary slip PDF."
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-toyota-red/20 focus:border-toyota-red transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Subject</label>
                  <input 
                    type="text" 
                    value={activeTemplate.subject || ''}
                    onChange={e => setActiveTemplate({...activeTemplate, subject: e.target.value})}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-toyota-red/20 focus:border-toyota-red transition-all"
                  />
                  <p className="text-[11px] text-gray-500 mt-1.5 flex gap-1 items-center">
                    Use placeholders like <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">{"{{employee_name}}"}</code>
                  </p>
                </div>

                <div className="flex flex-col h-[400px]">
                  <label className="block text-xs font-bold text-gray-900 mb-1.5">Email Body</label>
                  <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200 [&_.ql-container]:border-0 [&_.ql-editor]:text-sm [&_.ql-editor]:min-h-[200px]">
                    <ReactQuill 
                      theme="snow" 
                      value={activeTemplate.body_html || ''} 
                      onChange={(content) => setActiveTemplate({...activeTemplate, body_html: content})}
                      className="h-full flex flex-col"
                      modules={{
                        toolbar: [
                          [{ 'font': [] }, { 'size': [] }],
                          ['bold', 'italic', 'underline'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'align': [] }],
                          ['link', 'image', 'code-block'],
                          ['clean']
                        ]
                      }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-400 mt-2 text-right">
                    Characters: {activeTemplate.body_html?.replace(/<[^>]*>?/gm, '').length || 0}
                  </div>
                </div>
              </div>
            )}
            
            {/* Mobile/Tablet Preview Fallback */}
            {activeTab === 'Preview' && (
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50 lg:hidden">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-2xl mx-auto">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{generatePreviewSubject(activeTemplate.subject || '')}</h3>
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#16191D] flex items-center justify-center flex-shrink-0">
                        <SiToyota className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Toyota HR <span className="font-normal text-gray-500 text-xs ml-1">&lt;noreply@toyota.com&gt;</span></p>
                        <p className="text-xs text-gray-500">to john.doe@company.com</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="p-6 text-sm text-gray-800 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: generatePreviewHtml(activeTemplate.body_html || '') }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL - Live Preview (Desktop Only) */}
          <div className="w-[350px] xl:w-[450px] flex-shrink-0 hidden lg:flex flex-col bg-gray-50/50 rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-white flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-900">Preview</h3>
              <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded tracking-wide uppercase">Live</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Email Header */}
                <div className="p-5 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{generatePreviewSubject(activeTemplate.subject || '')}</h3>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#16191D] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <SiToyota className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Toyota HR <span className="font-medium text-gray-500 text-xs ml-1">&lt;noreply@toyota.com&gt;</span></p>
                        <p className="text-xs text-gray-500 mt-0.5">to john.doe@company.com</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">10:30 AM</span>
                  </div>
                </div>
                
                {/* Email Content */}
                <div 
                  className="p-6 text-sm text-gray-800 prose prose-sm max-w-none prose-headings:text-gray-900 prose-a:text-toyota-red prose-strong:text-gray-900"
                  dangerouslySetInnerHTML={{ __html: generatePreviewHtml(activeTemplate.body_html || '') }}
                />
                
                {/* Email Footer (Mock PDF Attachment) */}
                <div className="px-6 pb-6 pt-2">
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 w-fit cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-toyota-red font-bold text-xs">PDF</div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">SalarySlip_EMP001_May_2026.pdf</p>
                      <p className="text-[10px] text-gray-500">24 KB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50/50 rounded-xl border border-gray-100 border-dashed">
          <div className="text-center">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No Template Selected</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm">Select a template from the list on the left to view or edit it, or create a new one.</p>
          </div>
        </div>
      )}
      
    </div>
  );
}
