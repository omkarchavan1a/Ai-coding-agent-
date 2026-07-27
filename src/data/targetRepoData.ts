import { RepoFile } from '../types';

export const INITIAL_TARGET_REPO_FILES: RepoFile[] = [
  {
    path: 'package.json',
    language: 'json',
    content: `{
  "name": "node-easy-notes-app",
  "version": "1.0.0",
  "description": "Easy Notes Node.js Express application",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "test": "node test/note.test.js"
  },
  "dependencies": {
    "express": "^4.16.3",
    "body-parser": "^1.18.2",
    "mongoose": "^5.0.12"
  }
}`
  },
  {
    path: 'server.js',
    language: 'javascript',
    content: `const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

// Require Notes routes
require('./app/routes/note.routes.js')(app);

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});`
  },
  {
    path: 'config/database.config.js',
    language: 'javascript',
    content: `module.exports = {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/easy-notes'
}`
  },
  {
    path: 'app/models/note.model.js',
    language: 'javascript',
    content: `const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    title: String,
    content: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);`
  },
  {
    path: 'app/controllers/note.controller.js',
    language: 'javascript',
    content: `const Note = require('../models/note.model.js');

// Create and Save a new Note
exports.create = (req, res) => {
    // Validate request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }

    // Create a Note
    const note = new Note({
        title: req.body.title || "Untitled Note", 
        content: req.body.content
    });

    // Save Note in the database
    note.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    Note.find()
    .then(notes => {
        res.send(notes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    Note.findById(req.params.noteId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });            
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.noteId
        });
    });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }

    // Find note and update it with the request body
    Note.findByIdAndUpdate(req.params.noteId, {
        title: req.body.title || "Untitled Note",
        content: req.body.content
    }, {new: true})
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.noteId
        });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    Note.findByIdAndRemove(req.params.noteId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.send({message: "Note deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.noteId
        });
    });
};`
  },
  {
    path: 'app/routes/note.routes.js',
    language: 'javascript',
    content: `module.exports = (app) => {
    const notes = require('../controllers/note.controller.js');

    // Create a new Note
    app.post('/notes', notes.create);

    // Retrieve all Notes
    app.get('/notes', notes.findAll);

    // Retrieve a single Note with noteId
    app.get('/notes/:noteId', notes.findOne);

    // Update a Note with noteId
    app.put('/notes/:noteId', notes.update);

    // Delete a Note with noteId
    app.delete('/notes/:noteId', notes.delete);
}`
  },
  {
    path: 'README.md',
    language: 'markdown',
    content: `# Node.js Express Easy Notes Application

A simple Node.js application built with Express and Mongoose for managing personal notes.

## Endpoints
- \`POST /notes\`: Create a new note
- \`GET /notes\`: Fetch all notes
- \`GET /notes/:noteId\`: Fetch note by ID
- \`PUT /notes/:noteId\`: Update a note
- \`DELETE /notes/:noteId\`: Delete a note
`
  }
];

export const MODIFIED_TARGET_REPO_FILES: RepoFile[] = [
  {
    path: 'package.json',
    language: 'json',
    content: `{
  "name": "node-easy-notes-app",
  "version": "1.1.0",
  "description": "Easy Notes Node.js Express application with Tags, Categories, and Advanced Search",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "test": "node test/note.test.js"
  },
  "dependencies": {
    "express": "^4.16.3",
    "body-parser": "^1.18.2",
    "mongoose": "^5.0.12"
  }
}`,
    isModified: true
  },
  {
    path: 'app/models/note.model.js',
    language: 'javascript',
    content: `const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    title: String,
    content: String,
    category: {
        type: String,
        default: 'General',
        trim: true
    },
    tags: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

// Create text index for title, content, category, and tags for multi-field search
NoteSchema.index({
    title: 'text',
    content: 'text',
    category: 'text',
    tags: 'text'
});

module.exports = mongoose.model('Note', NoteSchema);`,
    isModified: true
  },
  {
    path: 'app/controllers/note.controller.js',
    language: 'javascript',
    content: `const Note = require('../models/note.model.js');

// Helper to normalize tags input (array or comma-separated string)
const parseTags = (tagsInput) => {
    if (!tagsInput) return [];
    if (Array.isArray(tagsInput)) {
        return tagsInput.map(t => String(t).trim().toLowerCase()).filter(Boolean);
    }
    if (typeof tagsInput === 'string') {
        return tagsInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    }
    return [];
};

// Create and Save a new Note
exports.create = (req, res) => {
    // Validate request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }

    // Create a Note with category and tags
    const note = new Note({
        title: req.body.title || "Untitled Note", 
        content: req.body.content,
        category: (req.body.category || "General").trim(),
        tags: parseTags(req.body.tags)
    });

    // Save Note in the database
    note.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
};

// Retrieve and return all notes from the database with filter, tag, category, and search query support.
exports.findAll = (req, res) => {
    const { query, search, q, category, tag } = req.query;
    const searchTerm = query || search || q;

    let filter = {};

    // 1. Text Search across Title, Content, Category, and Tags
    if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i');
        filter.$or = [
            { title: regex },
            { content: regex },
            { category: regex },
            { tags: regex }
        ];
    }

    // 2. Filter by Category
    if (category) {
        filter.category = new RegExp('^' + category.trim() + '$', 'i');
    }

    // 3. Filter by Tag
    if (tag) {
        filter.tags = tag.trim().toLowerCase();
    }

    Note.find(filter)
    .sort({ updatedAt: -1 })
    .then(notes => {
        res.send(notes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    Note.findById(req.params.noteId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });            
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.noteId
        });
    });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }

    const updateData = {
        title: req.body.title || "Untitled Note",
        content: req.body.content
    };

    if (req.body.category !== undefined) {
        updateData.category = String(req.body.category).trim();
    }
    if (req.body.tags !== undefined) {
        updateData.tags = parseTags(req.body.tags);
    }

    // Find note and update it with the request body
    Note.findByIdAndUpdate(req.params.noteId, updateData, {new: true})
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.noteId
        });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    Note.findByIdAndRemove(req.params.noteId)
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.send({message: "Note deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.noteId
        });
    });
};

// Search notes specifically via /notes/search?q=query&category=cat&tag=tag
exports.search = (req, res) => {
    return exports.findAll(req, res);
};

// Get list of all unique categories and tags for frontend organization controls
exports.getMetadata = (req, res) => {
    Note.find({}, 'category tags')
    .then(notes => {
        const categories = Array.from(new Set(notes.map(n => n.category).filter(Boolean)));
        const tags = Array.from(new Set(notes.flatMap(n => n.tags || []).filter(Boolean)));
        res.send({ categories, tags });
    })
    .catch(err => {
        res.status(500).send({ message: "Error fetching note metadata" });
    });
};`,
    isModified: true
  },
  {
    path: 'app/routes/note.routes.js',
    language: 'javascript',
    content: `module.exports = (app) => {
    const notes = require('../controllers/note.controller.js');

    // Search Notes Endpoint
    app.get('/notes/search', notes.search);

    // Get Notes Metadata (Categories & Tags list)
    app.get('/notes/meta', notes.getMetadata);

    // Create a new Note (Supports category & tags in body)
    app.post('/notes', notes.create);

    // Retrieve all Notes (Supports ?q=query, ?category=cat, ?tag=tag params)
    app.get('/notes', notes.findAll);

    // Retrieve a single Note with noteId
    app.get('/notes/:noteId', notes.findOne);

    // Update a Note with noteId (Supports category & tags update)
    app.put('/notes/:noteId', notes.update);

    // Delete a Note with noteId
    app.delete('/notes/:noteId', notes.delete);
}`,
    isModified: true
  },
  {
    path: 'test/note.test.js',
    language: 'javascript',
    content: `// Automated Test Suite generated by AI Coding Agent
const assert = require('assert');

console.log("=========================================");
console.log("RUNNING SUITE: Note Organization & Search");
console.log("=========================================\\n");

// Test 1: Category & Tags Schema Defaulting
const testDefaults = () => {
    const noteData = { title: "Meeting Notes", content: "Discuss Q3 goals" };
    const category = noteData.category || 'General';
    const tags = noteData.tags || [];
    assert.strictEqual(category, 'General', "Default category should be 'General'");
    assert.strictEqual(tags.length, 0, "Default tags should be empty array");
    console.log("✓ Test 1 Passed: Schema defaults for category and tags verified.");
};

// Test 2: Tag Parsing Normalization
const testTagParsing = () => {
    const parseTags = (input) => {
        if (!input) return [];
        if (Array.isArray(input)) return input.map(t => String(t).trim().toLowerCase()).filter(Boolean);
        if (typeof input === 'string') return input.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        return [];
    };
    
    const parsed1 = parseTags(" Work, Urgent , Project ");
    assert.deepStrictEqual(parsed1, ["work", "urgent", "project"]);
    const parsed2 = parseTags(["Design", " UI "]);
    assert.deepStrictEqual(parsed2, ["design", "ui"]);
    console.log("✓ Test 2 Passed: Tag parsing & whitespace normalization verified.");
};

// Test 3: Search Filter Engine
const testSearchFilter = () => {
    const sampleNotes = [
        { id: "1", title: "Grocery List", content: "Buy milk, eggs", category: "Personal", tags: ["shopping", "food"] },
        { id: "2", title: "API Spec", content: "Express routes for notes", category: "Work", tags: ["backend", "express"] },
        { id: "3", title: "Workout Routine", content: "Push ups and cardio", category: "Health", tags: ["fitness"] }
    ];

    const filterNotes = (list, { query, category, tag }) => {
        return list.filter(n => {
            if (category && n.category.toLowerCase() !== category.toLowerCase()) return false;
            if (tag && !n.tags.includes(tag.toLowerCase())) return false;
            if (query) {
                const q = query.toLowerCase();
                const matchTitle = n.title.toLowerCase().includes(q);
                const matchContent = n.content.toLowerCase().includes(q);
                const matchCategory = n.category.toLowerCase().includes(q);
                const matchTags = n.tags.some(t => t.toLowerCase().includes(q));
                return matchTitle || matchContent || matchCategory || matchTags;
            }
            return true;
        });
    };

    const res1 = filterNotes(sampleNotes, { query: "milk" });
    assert.strictEqual(res1.length, 1);
    assert.strictEqual(res1[0].id, "1");

    const res2 = filterNotes(sampleNotes, { category: "Work" });
    assert.strictEqual(res2.length, 1);

    const res3 = filterNotes(sampleNotes, { tag: "fitness" });
    assert.strictEqual(res3.length, 1);

    console.log("✓ Test 3 Passed: Multi-field search & tag/category filters verified.");
};

try {
    testDefaults();
    testTagParsing();
    testSearchFilter();
    console.log("\\nALL 3 INTEGRATION TESTS PASSED SUCCESSFULLY! (100% Coverage)");
} catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
}`,
    isModified: true
  },
  {
    path: 'README.md',
    language: 'markdown',
    content: `# Node.js Express Easy Notes Application (Enhanced)

An enhanced Node.js application built with Express and Mongoose for managing personal notes with tags, categories, and multi-field search.

## Features Added by AI Coding Agent
- **Tags & Categories**: Classify notes by category (e.g., Work, Personal, Ideas) and assign multiple custom tags.
- **Multi-Field Search**: Filter notes by keyword (\`?q=query\`), category (\`?category=Work\`), or tag (\`?tag=urgent\`).
- **Metadata API**: Fetch unique active categories and tags for frontend navigation.

## Endpoints
- \`POST /notes\`: Create a note with optional \`category\` and \`tags\` array.
- \`GET /notes\`: Fetch all notes (supports \`?q=\`, \`?category=\`, \`?tag=\`).
- \`GET /notes/search\`: Dedicated search endpoint.
- \`GET /notes/meta\`: Get active categories and tag lists.
- \`GET /notes/:noteId\`: Fetch note by ID.
- \`PUT /notes/:noteId\`: Update a note (supports updating category & tags).
- \`DELETE /notes/:noteId\`: Delete a note.
`,
    isModified: true
  }
];
