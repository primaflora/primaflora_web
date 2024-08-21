import { useEffect, useState } from "react";
import { Panel } from "../../components/Panel"
import { Checkbox } from "../../components/Panel/Panel"
import './styles.css';
import { TSortType } from "../../components/Panel/types";
import { Row } from "../../../../components/common";

const ListHeaders = [
    { label: 'Author', value: 'author' }, 
    { label: 'Comment', value: 'comment' }, 
    { label: 'In response to', value: 'postTitle' }, 
    { label: 'Date', value: 'date' }
];
type TCommentState = 'approved' | 'pending' | 'rejected';
type TCommentTest = {
    isChecked: boolean;
    state: TCommentState
    author: {
        name: string;
        email: string;
    };
    comment: string;
    postTitle: string;
    date: string;
}
type TCommentTestKeys = keyof TCommentTest;
const data: Array<TCommentTest> = [
    {
      isChecked: false,
      state: 'pending',
      author: {
        name: 'Charlie Davis',
        email: 'charlie.davis@example.com'
      },
      comment: 'I have a question regarding the second example.',
      postTitle: 'Advanced CSS Techniques',
      date: '2024-08-01T16:45:50Z'
    },
    {
      isChecked: false,
      state: 'pending',
      author: {
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com'
      },
      comment: 'I found this post very helpful, thanks!',
      postTitle: 'Mastering TypeScript',
      date: '2024-08-03T14:07:22Z'
    },
    {
      isChecked: false,
      state: 'pending',
      author: {
        name: 'Bob Brown',
        email: 'bob.brown@example.com'
      },
      comment: 'Can you provide more examples on this topic?',
      postTitle: 'Introduction to Node.js',
      date: '2024-08-02T08:30:00Z'
    },
    {
      isChecked: false,
      state: 'approved',
      author: {
        name: 'John Doe',
        email: 'john.doe@example.com'
      },
      comment: 'This is a sample comment from John Doe.',
      postTitle: 'Understanding JavaScript Closures',
      date: '2024-08-05T10:15:30Z'
    },
    {
      isChecked: false,
      state: 'rejected',
      author: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com'
      },
      comment: 'Great article on React hooks!',
      postTitle: 'React Hooks: A Complete Guide',
      date: '2024-08-04T09:12:45Z'
    },
    {
      isChecked: false,
      state: 'pending',
      author: {
        name: 'Emily White',
        email: 'emily.white@example.com'
      },
      comment: 'The explanation of async/await was very clear.',
      postTitle: 'JavaScript Async/Await Explained',
      date: '2024-08-06T11:20:10Z'
    },
    {
      isChecked: false,
      state: 'approved',
      author: {
        name: 'Michael Green',
        email: 'michael.green@example.com'
      },
      comment: 'Can you add a section on error handling?',
      postTitle: 'Error Handling in JavaScript',
      date: '2024-08-07T12:45:00Z'
    },
    {
      isChecked: false,
      state: 'rejected',
      author: {
        name: 'Sarah Lee',
        email: 'sarah.lee@example.com'
      },
      comment: 'I enjoyed the deep dive into the DOM.',
      postTitle: 'Understanding the DOM',
      date: '2024-08-08T15:30:00Z'
    },
    {
      isChecked: false,
      state: 'pending',
      author: {
        name: 'Daniel Martinez',
        email: 'daniel.martinez@example.com'
      },
      comment: 'The comparison between REST and GraphQL was insightful.',
      postTitle: 'REST vs GraphQL',
      date: '2024-08-09T17:05:20Z'
    },
    {
      isChecked: false,
      state: 'pending',
      author: {
        name: 'Laura Wilson',
        email: 'laura.wilson@example.com'
      },
      comment: 'More examples on testing would be helpful.',
      postTitle: 'Testing JavaScript Applications',
      date: '2024-08-10T09:45:55Z'
    },
    {
      isChecked: false,
      state: 'approved',
      author: {
        name: 'James Anderson',
        email: 'james.anderson@example.com'
      },
      comment: 'The tips on performance optimization were useful.',
      postTitle: 'Performance Optimization in Web Apps',
      date: '2024-08-11T14:20:30Z'
    }
]  

export const AdminComments = () => {
    const [comments, setComments] = useState<Array<TCommentTest>>(data);

    const formateDate = (date: Date) => {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} 
                at ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    }

    const handleCheckboxChange = (checked: boolean, index: number) => {
        const updatedComments = [...comments];
        updatedComments[index].isChecked = checked;
        setComments(updatedComments);
    }

    const handleGlobalCheckboxChange = (checked: boolean) => {
        setComments(prevState => prevState.map(comment => ({ ...comment, isChecked: checked })));
    }

    const onSortChange = (sortBy: string, sortType: TSortType) => {
        const sortedComments = [...comments].sort((a: TCommentTest, b: TCommentTest) => {
            const aValue = a[sortBy as TCommentTestKeys];
            const bValue = b[sortBy as TCommentTestKeys];

            // if values are object (then author header selected and sorting by name) 
            if (typeof aValue === 'object' && typeof bValue === 'object') {
                if (aValue.name < bValue.name) {
                    return sortType === 'ASC' ? -1 : 1;
                } else {
                    return sortType === 'ASC' ? 1 : -1;
                }
            }

            // if values are date
            if (!isNaN(Date.parse(aValue as string)) && !isNaN(Date.parse(bValue as string))) {
                if (new Date(aValue as string).getTime() < new Date(bValue as string).getTime()) {
                    return sortType === 'ASC' ? -1 : 1;
                } else {
                    return sortType === 'ASC' ? 1 : -1;
                }
            }

            // if just string
            if (a[sortBy as keyof TCommentTest] < b[sortBy as keyof TCommentTest]) {
                return sortType === 'ASC' ? -1 : 1;
            }
            if (a[sortBy as keyof TCommentTest] > b[sortBy as keyof TCommentTest]) {
                return sortType === 'ASC' ? 1 : -1;
            }
            return 0;
        });
        setComments(sortedComments);
    }

    const handleFilterStateChange = (state: TCommentState | 'all') => {
        if (state === 'all') {
            setComments(data);
            return;
        }

        const filteredComments = [...data].filter(comment => comment.state === state);
        setComments(filteredComments);
    }

    return (
        <div>
            <Panel.Title text="Comments" />
            
            <Row style={{ justifyContent: 'space-between', gap: '1rem', padding: '5px 0' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                    <h1>Filter: </h1>
                    <SortList onFilterStateChange={handleFilterStateChange} data={data} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                    <TableActionList onSelectChange={() => {}} />
                    <Panel.Button text="Apply Changes" small isFilled={false} onClick={() => {}} />
                </div>
            </Row>

            <Panel.List<TCommentTest> 
                onCheckmarkUpdate={handleGlobalCheckboxChange}
                onSortChange={onSortChange}
                header={ListHeaders} 
                data={comments}>
                {(entry, index) => (
                    <tr className="table-row-container">
                        <td className="table-checkbox-container">
                            <Checkbox 
                                state={entry.isChecked} 
                                onChange={(checked) => handleCheckboxChange(checked, index)}/>
                        </td>
                        <td>
                            <div className="author-info">
                                <h1>{entry.author.name}</h1>
                                <h1>{entry.author.email}</h1>
                            </div>
                        </td>
                        <td className="table-comment-container">
                            <td>{entry.comment}</td>
                            <ActionRow commentState={entry.state} />
                        </td>
                        <td>{entry.postTitle}</td>
                        <td>{formateDate(new Date(entry.date))}</td>
                    </tr>
                )}
            </Panel.List>
        </div>
    )
}

const ActionRow = ({commentState}: {commentState?: TCommentState}) => {
    return (
        <div className='panel-table-action-row'>
            {commentState && <h1>{commentState.toUpperCase()[0] + commentState.slice(1)}</h1>}
            <button className='panel-approve-button'>Approve</button>
            <button className='panel-reject-button'>Reject</button>
        </div>
    )
}

const SortList = ({ onFilterStateChange, data }: { data: TCommentTest[], onFilterStateChange: (state: TCommentState | 'all') => void }) => {
    const findAmount = (state?: TCommentState) => {
        if (!state) return data.length;

        return data.filter(comment => comment.state === state).length
    }
    
    return (
        <div className="panel-sort-list">
            <button 
                className='panel-all-button' 
                onClick={() => onFilterStateChange('all')}>
                    All <span>({findAmount()})</span>
            </button>
            <button 
                className='panel-pending-button' 
                onClick={() => onFilterStateChange('pending')}>
                    Pending <span>({findAmount('pending')})</span>
            </button>
            <button 
                className='panel-approved-button'
                onClick={() => onFilterStateChange('approved')}>
                    Approved <span>({findAmount('approved')})</span>
            </button>
            <button 
                className='panel-reject-button'
                onClick={() => onFilterStateChange('rejected')}>
                    Rejected <span>({findAmount('rejected')})</span>
            </button>
        </div>
    )
}

const TableActionList = ({ onSelectChange }: {onSelectChange: (value: 'approve' | 'reject') => void}) => {
    const [selected, setSelected] = useState<'approve' | 'reject' | '-'>('-');

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value === '-') {
            return;
        }
        const newValue = event.target.value as 'approve' | 'reject';
        setSelected(newValue);
        onSelectChange(newValue);
    }

    return (
        <select value={selected} onChange={handleSelectChange}>
            <option value={'-'}>Bulk Action</option>
            <option value={'approve'}>Approve</option>
            <option value={'reject'}>Reject</option>
        </select>
    );
}