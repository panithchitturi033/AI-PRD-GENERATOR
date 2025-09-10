import React from 'react';
import type { PRD, UserPersona, Feature, NonFunctionalRequirement } from '../types';
import { UserGroupIcon, StarIcon, CheckBadgeIcon, ChartBarIcon, DocumentDuplicateIcon, LightBulbIcon, TrashIcon, PlusCircleIcon } from './Icons';

interface PRDDisplayProps {
  prd: PRD;
  setPrd: (prd: PRD) => void;
}

// A helper component for an auto-resizing textarea
const EditableTextarea: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; className?: string, placeholder?: string }> = ({ value, onChange, className, placeholder }) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-2 bg-gray-800/40 border border-gray-700 rounded-md focus:bg-gray-800/80 focus:ring-2 focus:ring-yellow-400/80 focus:border-yellow-400 transition-all duration-200 resize-none overflow-hidden text-gray-200 placeholder-gray-500 ${className}`}
    />
  );
};

const Card: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className="bg-black/20 border border-yellow-500/20 rounded-xl shadow-2xl shadow-yellow-500/5 backdrop-blur-lg overflow-hidden mb-6">
        <div className="p-4 bg-black/20 border-b border-yellow-500/20 flex items-center gap-3">
            {icon}
            <h3 className="text-lg font-bold text-yellow-400" style={{textShadow: '0 0 4px rgba(250, 204, 21, 0.5)'}}>{title}</h3>
        </div>
        <div className="p-4 md:p-6">
            {children}
        </div>
    </div>
);

const AddItemButton: React.FC<{ onClick: () => void; children: React.ReactNode; }> = ({ onClick, children }) => (
    <button onClick={onClick} className="mt-2 flex items-center gap-2 text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors duration-200">
        <PlusCircleIcon className="w-5 h-5"/>
        {children}
    </button>
);


export const PRDDisplay: React.FC<PRDDisplayProps> = ({ prd, setPrd }) => {
    
  const copyToClipboard = () => {
    const prdString = JSON.stringify(prd, null, 2);
    navigator.clipboard.writeText(prdString);
    alert('PRD content copied to clipboard as JSON!');
  };

  const handleIntroChange = (field: keyof PRD['introduction'], value: string) => {
    setPrd({ ...prd, introduction: { ...prd.introduction, [field]: value } });
  }

  const handleFieldChange = <T, K extends keyof T,>(
    index: number,
    field: K,
    value: T[K],
    section: keyof PRD
  ) => {
    const newPrd = { ...prd };
    const sectionArray = newPrd[section] as T[];
    if (sectionArray && sectionArray[index]) {
      sectionArray[index] = { ...sectionArray[index], [field]: value };
      setPrd(newPrd);
    }
  };

  const addSectionItem = (section: 'userPersonas' | 'features' | 'nonFunctionalRequirements') => {
    const newPrd = { ...prd };
    const newSectionArray = [...newPrd[section]] as any[];
    let newItem;
    if (section === 'userPersonas') {
        newItem = { name: 'New Persona', demographics: 'Demographics', goals: ['New Goal'], frustrations: ['New Frustration'] };
    } else if (section === 'features') {
        newItem = { featureName: 'New Feature', description: 'Feature description', userStories: ['As a user...'], priority: 'Medium' };
    } else { 
        newItem = { requirement: 'New Requirement', details: 'Details of requirement' };
    }
    newSectionArray.push(newItem);
    setPrd({ ...newPrd, [section]: newSectionArray });
  };

  const removeSectionItem = (section: 'userPersonas' | 'features' | 'nonFunctionalRequirements', index: number) => {
    const newPrd = { ...prd };
    const newSectionArray = [...newPrd[section]];
    newSectionArray.splice(index, 1);
    setPrd({ ...newPrd, [section]: newSectionArray });
  };
  
  const handleSimpleListChange = (index: number, value: string, section: 'successMetrics') => {
    const newPrd = { ...prd };
    const newArray = [...newPrd[section]];
    newArray[index] = value;
    setPrd({ ...newPrd, [section]: newArray });
  };

  const addSimpleListItem = (section: 'successMetrics') => {
    const newPrd = { ...prd };
    setPrd({ ...newPrd, [section]: [...newPrd[section], 'New metric'] });
  };

  const removeSimpleListItem = (section: 'successMetrics', index: number) => {
    const newPrd = { ...prd };
    const newArray = [...newPrd[section]];
    newArray.splice(index, 1);
    setPrd({ ...newPrd, [section]: newArray });
  };

  const handleNestedListChange = (
    section: 'userPersonas' | 'features',
    itemIndex: number,
    nestedKey: 'goals' | 'frustrations' | 'userStories',
    nestedIndex: number,
    value: string
  ) => {
    const newPrd = { ...prd };
    const sectionArray = [...newPrd[section]] as any[];
    const item = { ...sectionArray[itemIndex] };
    const nestedArray = [...item[nestedKey]];
    nestedArray[nestedIndex] = value;
    item[nestedKey] = nestedArray;
    sectionArray[itemIndex] = item;
    setPrd({ ...newPrd, [section]: sectionArray });
  };

  const addNestedListItem = (
    section: 'userPersonas' | 'features',
    itemIndex: number,
    nestedKey: 'goals' | 'frustrations' | 'userStories'
  ) => {
    const newPrd = { ...prd };
    const sectionArray = [...newPrd[section]] as any[];
    const item = { ...sectionArray[itemIndex] };
    const nestedArray = [...item[nestedKey], ''];
    item[nestedKey] = nestedArray;
    sectionArray[itemIndex] = item;
    setPrd({ ...newPrd, [section]: sectionArray });
  };

  const removeNestedListItem = (
    section: 'userPersonas' | 'features',
    itemIndex: number,
    nestedKey: 'goals' | 'frustrations' | 'userStories',
    nestedIndex: number
  ) => {
    const newPrd = { ...prd };
    const sectionArray = [...newPrd[section]] as any[];
    const item = { ...sectionArray[itemIndex] };
    const nestedArray = [...item[nestedKey]];
    nestedArray.splice(nestedIndex, 1);
    item[nestedKey] = nestedArray;
    sectionArray[itemIndex] = item;
    setPrd({ ...newPrd, [section]: sectionArray });
  };


  return (
    <div className="w-full animate-fade-in">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-4xl font-bold text-white" style={{textShadow: '0 0 15px rgba(250, 204, 21, 0.5)'}}>
                <EditableTextarea value={prd.title} onChange={(e) => setPrd({...prd, title: e.target.value})} className="text-4xl font-bold !p-0 bg-transparent border-none focus:ring-0 focus:bg-gray-800/50 rounded text-white"/>
            </h2>
            <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 text-gray-300 hover:bg-yellow-500 hover:text-black border border-gray-700 hover:border-yellow-500 rounded-lg transition-all duration-200 text-sm font-medium">
                <DocumentDuplicateIcon className="w-5 h-5"/>
                Copy JSON
            </button>
        </div>
        
        <Card icon={<LightBulbIcon className="w-6 h-6 text-yellow-400" style={{filter: 'drop-shadow(0 0 5px rgba(250, 204, 21, 0.7))'}}/>} title="Introduction">
             <div className="space-y-4">
                <div>
                    <label className="font-semibold text-gray-300 block mb-1">Problem Statement</label>
                    <EditableTextarea value={prd.introduction.problemStatement} onChange={(e) => handleIntroChange('problemStatement', e.target.value)} />
                </div>
                <div>
                    <label className="font-semibold text-gray-300 block mb-1">Solution</label>
                    <EditableTextarea value={prd.introduction.solution} onChange={(e) => handleIntroChange('solution', e.target.value)} />
                </div>
                <div>
                    <label className="font-semibold text-gray-300 block mb-1">Target Audience</label>
                    <EditableTextarea value={prd.introduction.targetAudience} onChange={(e) => handleIntroChange('targetAudience', e.target.value)} />
                </div>
             </div>
        </Card>

        <Card icon={<UserGroupIcon className="w-6 h-6 text-yellow-400" style={{filter: 'drop-shadow(0 0 5px rgba(250, 204, 21, 0.7))'}}/>} title="User Personas">
            <div className="space-y-6">
            {prd.userPersonas.map((persona, index) => (
                <div key={index} className="relative p-4 border border-gray-700/50 rounded-lg bg-gray-900/30 group/persona">
                    <button onClick={() => removeSectionItem('userPersonas', index)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500 opacity-0 group-hover/persona:opacity-100 transition-opacity z-10">
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                    <EditableTextarea value={persona.name} onChange={(e) => handleFieldChange<UserPersona, 'name'>(index, 'name', e.target.value, 'userPersonas')} className="!text-lg !font-semibold text-yellow-300 !p-1 mb-2 !bg-transparent !border-none focus:!bg-gray-800/80"/>
                    <p className="text-sm text-gray-400 mb-2">
                        <EditableTextarea value={persona.demographics} onChange={(e) => handleFieldChange<UserPersona, 'demographics'>(index, 'demographics', e.target.value, 'userPersonas')} />
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h5 className="font-semibold text-gray-400 mb-1">Goals</h5>
                            <ul className="list-disc list-inside space-y-1">
                                {persona.goals.map((goal, gIndex) => 
                                <li key={gIndex} className="flex items-center gap-2 group/item">
                                    <EditableTextarea value={goal} onChange={(e) => handleNestedListChange('userPersonas', index, 'goals', gIndex, e.target.value)} placeholder="Enter goal..."/>
                                    <button onClick={() => removeNestedListItem('userPersonas', index, 'goals', gIndex)} className="text-gray-500 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </li>)}
                            </ul>
                            <AddItemButton onClick={() => addNestedListItem('userPersonas', index, 'goals')}>Add Goal</AddItemButton>
                        </div>
                         <div>
                            <h5 className="font-semibold text-gray-400 mb-1">Frustrations</h5>
                            <ul className="list-disc list-inside space-y-1">
                                {persona.frustrations.map((frustration, fIndex) => 
                                <li key={fIndex} className="flex items-center gap-2 group/item">
                                    <EditableTextarea value={frustration} onChange={(e) => handleNestedListChange('userPersonas', index, 'frustrations', fIndex, e.target.value)} placeholder="Enter frustration..."/>
                                    <button onClick={() => removeNestedListItem('userPersonas', index, 'frustrations', fIndex)} className="text-gray-500 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </li>)}
                            </ul>
                            <AddItemButton onClick={() => addNestedListItem('userPersonas', index, 'frustrations')}>Add Frustration</AddItemButton>
                        </div>
                    </div>
                </div>
            ))}
             <AddItemButton onClick={() => addSectionItem('userPersonas')}>Add Persona</AddItemButton>
            </div>
        </Card>

        <Card icon={<StarIcon className="w-6 h-6 text-yellow-400" style={{filter: 'drop-shadow(0 0 5px rgba(250, 204, 21, 0.7))'}}/>} title="Features">
            <div className="space-y-6">
            {prd.features.map((feature, index) => (
                <div key={index} className="relative p-4 border border-gray-700/50 rounded-lg group/feature bg-gray-900/30">
                    <button onClick={() => removeSectionItem('features', index)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500 opacity-0 group-hover/feature:opacity-100 transition-opacity z-10">
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                    <div className="flex justify-between items-start mb-2">
                         <EditableTextarea value={feature.featureName} onChange={(e) => handleFieldChange<Feature, 'featureName'>(index, 'featureName', e.target.value, 'features')} className="!text-lg !font-semibold text-yellow-300 !p-1 !bg-transparent !border-none focus:!bg-gray-800/80"/>
                         <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${feature.priority === 'High' ? 'bg-red-500/10 text-red-300 border-red-500/30' : feature.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30' : 'bg-green-500/10 text-green-300 border-green-500/30'}`}>{feature.priority}</span>
                    </div>
                     <EditableTextarea value={feature.description} onChange={(e) => handleFieldChange<Feature, 'description'>(index, 'description', e.target.value, 'features')} />
                    <h5 className="font-semibold text-gray-400 mt-3 mb-1">User Stories</h5>
                     <ul className="list-disc list-inside space-y-1 text-gray-300 italic">
                       {feature.userStories.map((story, sIndex) => 
                       <li key={sIndex} className="flex items-center gap-2 group/item">
                            <EditableTextarea value={story} onChange={(e) => handleNestedListChange('features', index, 'userStories', sIndex, e.target.value)} placeholder="As a user..."/>
                            <button onClick={() => removeNestedListItem('features', index, 'userStories', sIndex)} className="text-gray-500 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                       </li>)}
                    </ul>
                    <AddItemButton onClick={() => addNestedListItem('features', index, 'userStories')}>Add User Story</AddItemButton>
                </div>
            ))}
            <AddItemButton onClick={() => addSectionItem('features')}>Add Feature</AddItemButton>
            </div>
        </Card>
        
        <Card icon={<CheckBadgeIcon className="w-6 h-6 text-yellow-400" style={{filter: 'drop-shadow(0 0 5px rgba(250, 204, 21, 0.7))'}}/>} title="Non-Functional Requirements">
            <div className="space-y-4">
            {prd.nonFunctionalRequirements.map((req, index) => (
                <div key={index} className="relative p-2 group/req">
                     <button onClick={() => removeSectionItem('nonFunctionalRequirements', index)} className="absolute top-1 right-1 text-gray-500 hover:text-red-500 opacity-0 group-hover/req:opacity-100 transition-opacity z-10">
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                     <EditableTextarea value={req.requirement} onChange={(e) => handleFieldChange<NonFunctionalRequirement, 'requirement'>(index, 'requirement', e.target.value, 'nonFunctionalRequirements')} className="!text-lg !font-semibold text-yellow-300 !p-1 mb-1 !bg-transparent !border-none focus:!bg-gray-800/80"/>
                     <EditableTextarea value={req.details} onChange={(e) => handleFieldChange<NonFunctionalRequirement, 'details'>(index, 'details', e.target.value, 'nonFunctionalRequirements')} />
                </div>
            ))}
            <AddItemButton onClick={() => addSectionItem('nonFunctionalRequirements')}>Add Requirement</AddItemButton>
            </div>
        </Card>

        <Card icon={<ChartBarIcon className="w-6 h-6 text-yellow-400" style={{filter: 'drop-shadow(0 0 5px rgba(250, 204, 21, 0.7))'}}/>} title="Success Metrics">
            <ul className="list-disc list-inside space-y-2">
                {prd.successMetrics.map((metric, index) => (
                    <li key={index} className="flex items-center gap-2 group/item">
                        <EditableTextarea value={metric} onChange={(e) => handleSimpleListChange(index, e.target.value, 'successMetrics')} />
                        <button onClick={() => removeSimpleListItem('successMetrics', index)} className="text-gray-500 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </li>
                ))}
            </ul>
             <AddItemButton onClick={() => addSimpleListItem('successMetrics')}>Add Metric</AddItemButton>
        </Card>

    </div>
  );
};