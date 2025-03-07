# Community Forums Backend

The backend API service for the Community Forums project, built with Node.js, Express, TypeScript, and TypeORM.

## Directory Structure

```
backend/
├── src/
│   ├── config/        # Configuration files
│   ├── controllers/   # Request handlers
│   ├── entities/      # TypeORM entities
│   ├── middleware/    # Custom middleware
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── types/         # TypeScript types
│   ├── utils/         # Utility functions
│   └── app.ts         # Express application setup
├── tests/             # Test files
└── README.md          # This file
```

## Database Schema

### Users
```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Forum, forum => forum.user)
  forums: Forum[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];
}
```

### Forums
```typescript
@Entity()
export class Forum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @ManyToOne(() => User, user => user.forums)
  user: User;

  @OneToMany(() => Comment, comment => comment.forum)
  comments: Comment[];

  @Column('int', { default: 0 })
  likes: number;
}
```

### Comments
```typescript
@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @ManyToOne(() => User, user => user.comments)
  user: User;

  @ManyToOne(() => Forum, forum => forum.comments)
  forum: Forum;

  @Column('int', { default: 0 })
  likes: number;
}
```

## API Endpoints

### Authentication
```typescript
// POST /api/auth/register
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

// GET /api/auth/me
// Returns current user data
```

### Forums
```typescript
// GET /api/forums
// Query parameters: page, limit, search, tags

// GET /api/forums/:id
// URL parameters: id

// POST /api/forums
interface CreateForumRequest {
  title: string;
  description: string;
  tags?: string[];
}

// PUT /api/forums/:id
interface UpdateForumRequest {
  title?: string;
  description?: string;
  tags?: string[];
}

// DELETE /api/forums/:id
// URL parameters: id

// POST /api/forums/:id/like
// URL parameters: id
```

### Comments
```typescript
// GET /api/comments/forum/:forumId
// URL parameters: forumId
// Query parameters: page, limit

// POST /api/comments/forum/:forumId
interface CreateCommentRequest {
  content: string;
}

// PUT /api/comments/:id
interface UpdateCommentRequest {
  content: string;
}

// DELETE /api/comments/:id
// URL parameters: id

// POST /api/comments/:id/like
// URL parameters: id
```

## Performance Optimizations

### Database Indexing
```typescript
@Entity()
export class Forum {
  @Index()
  @Column()
  title: string;

  @Index()
  @Column('simple-array')
  tags: string[];
}
```

### Query Optimization
```typescript
// Using QueryBuilder for complex queries
const forums = await this.forumRepository
  .createQueryBuilder('forum')
  .leftJoinAndSelect('forum.user', 'user')
  .where('forum.title LIKE :search', { search: `%${searchTerm}%` })
  .orWhere('forum.tags @> ARRAY[:...tags]', { tags })
  .take(limit)
  .skip(offset)
  .getMany();
```

### Caching
```typescript
// Using TypeORM query cache
const forums = await this.forumRepository.find({
  cache: {
    id: 'forums',
    milliseconds: 60000 // 1 minute
  }
});
```

## Security Measures

### Password Hashing
```typescript
// Using bcrypt for password hashing
const hashedPassword = await bcrypt.hash(password, 10);
```

### JWT Authentication
```typescript
// Generating JWT token
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET!,
  { expiresIn: '24h' }
);
```

### Request Validation
```typescript
// Using class-validator
@IsString()
@MinLength(3)
@MaxLength(50)
title: string;

@IsString()
@MinLength(10)
description: string;

@IsArray()
@IsString({ each: true })
@IsOptional()
tags?: string[];
```

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Configure environment variables:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=forums_db
JWT_SECRET=your_jwt_secret
```

4. Start development server:
```bash
npm run dev
```

## Database Migration

```bash
# Generate migration
npm run typeorm migration:generate -- -n CreateTables

# Run migrations
npm run typeorm migration:run

# Revert migration
npm run typeorm migration:revert
```

## Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run tests with coverage
npm run test:coverage
```

## Error Handling

```typescript
// Custom error classes
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
  }
}

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }
  
  return res.status(500).json({
    error: 'Internal server error'
  });
});
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build TypeScript code
- `npm start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typeorm` - Run TypeORM CLI commands 