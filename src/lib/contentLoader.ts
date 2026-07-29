export interface ProjectFrontmatter {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  thumbnailBg: string;
  thumbnailType: string;
  thumbnailImage?: string;
  imageCaption: string;
  order?: number;
}

export interface ProjectPost {
  metadata: ProjectFrontmatter;
  content: string; // Markdown body
}

export interface ExperienceFrontmatter {
  id: string;
  company: string;
  role: string;
  period: string;
  tag: string;
  skills: string[];
  order?: number;
}

export interface ExperienceBullet {
  iconType: string;
  text: string;
}

export interface ExperienceItem {
  metadata: ExperienceFrontmatter;
  bullets: ExperienceBullet[];
  rawMarkdown: string;
}

export interface HomeContent {
  metadata: {
    name?: string;
    role?: string;
    subtitle?: string;
    location?: string;
    [key: string]: any;
  };
  content: string;
}

// Vite glob import for all images in the workspace / src directory
const imageModules = import.meta.glob('/src/**/*.{png,jpg,jpeg,svg,webp,gif,avif,PNG,JPG,JPEG,SVG,WEBP,GIF}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

/**
 * Resolves relative asset paths (e.g., "../images/a.png", "images/a.png", "./images/a.png")
 * to Vite's bundled image URLs.
 */
export function resolveAssetUrl(rawPath: string | undefined): string {
  if (!rawPath) return '';

  // Return as-is if already an HTTP/HTTPS URL, data URI, or blob
  if (
    rawPath.startsWith('http://') ||
    rawPath.startsWith('https://') ||
    rawPath.startsWith('data:') ||
    rawPath.startsWith('blob:')
  ) {
    return rawPath;
  }

  // Normalize backslashes (Windows-style paths)
  const cleanPath = rawPath.replace(/\\/g, '/').trim();

  // 1. Direct match in glob map
  if (imageModules[cleanPath]) {
    return imageModules[cleanPath];
  }

  // 2. Relative resolution from markdown base directory (/src/content/projects)
  const baseSegments = ['src', 'content', 'projects'];
  const pathSegments = cleanPath.split('/').filter(Boolean);

  const resolvedStack = [...baseSegments];
  for (const seg of pathSegments) {
    if (seg === '.') continue;
    if (seg === '..') {
      if (resolvedStack.length > 0) resolvedStack.pop();
    } else {
      resolvedStack.push(seg);
    }
  }

  const resolvedAbsolutePath = '/' + resolvedStack.join('/');
  if (imageModules[resolvedAbsolutePath]) {
    return imageModules[resolvedAbsolutePath];
  }

  // 3. Common directory candidate prefixes
  const candidatePrefixes = [
    `/src/content/${cleanPath}`,
    `/src/content/projects/${cleanPath}`,
    `/src/content/images/${cleanPath}`,
    `/src/${cleanPath}`,
    `/${cleanPath}`,
  ];
  for (const candidate of candidatePrefixes) {
    if (imageModules[candidate]) {
      return imageModules[candidate];
    }
  }

  // 4. Fallback matching by filename or suffix
  const filename = cleanPath.split('/').pop();
  if (filename) {
    for (const key in imageModules) {
      if (key.endsWith('/' + cleanPath) || key.endsWith(cleanPath) || key.endsWith('/' + filename)) {
        return imageModules[key];
      }
    }
  }

  return cleanPath;
}

// Simple YAML frontmatter parser
function parseFrontmatter(raw: string): { metadata: Record<string, any>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { metadata: {}, content: raw };
  }

  const [, frontmatterStr, content] = match;
  const metadata: Record<string, any> = {};

  frontmatterStr.split('\n').forEach((line) => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;

    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    // Remove surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Parse array e.g. ["Hiring", "Startups", "Engineering"]
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayContent = value.slice(1, -1);
      metadata[key] = arrayContent
        .split(',')
        .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
    } else if (!isNaN(Number(value)) && value !== '') {
      metadata[key] = Number(value);
    } else {
      metadata[key] = value;
    }
  });

  return { metadata, content };
}

// Vite glob import for all project markdown files
const projectModules = import.meta.glob('/src/content/projects/*.md', {
  query: '?raw',
  eager: true,
}) as Record<string, { default: string } | string>;

// Vite glob import for all experience markdown files
const experienceModules = import.meta.glob('/src/content/experience/*.md', {
  query: '?raw',
  eager: true,
}) as Record<string, { default: string } | string>;

// Vite glob import for home markdown files
const homeModules = import.meta.glob('/src/content/home*.md', {
  query: '?raw',
  eager: true,
}) as Record<string, { default: string } | string>;

const snippetModules = import.meta.glob('/src/content/snippets/*.md', {
  query: '?raw',
  eager: true,
}) as Record<string, { default: string } | string>;

export function getAllProjects(): ProjectPost[] {
  const posts: ProjectPost[] = [];

  for (const path in projectModules) {
    const mod = projectModules[path];
    const rawContent = typeof mod === 'string' ? mod : mod.default || '';
    const { metadata, content } = parseFrontmatter(rawContent);

    if (metadata.id && metadata.title) {
      // Check if frontmatter specifies an image for thumbnail
      const rawImage =
        metadata.thumbnailImage ||
        metadata.thumbnail ||
        metadata.image ||
        (metadata.thumbnailType &&
        (metadata.thumbnailType.includes('/') ||
          metadata.thumbnailType.includes('.') ||
          metadata.thumbnailType.startsWith('http') ||
          metadata.thumbnailType.startsWith('data:'))
          ? metadata.thumbnailType
          : undefined);

      const resolvedImage = rawImage ? resolveAssetUrl(rawImage) : undefined;

      posts.push({
        metadata: {
          id: metadata.id,
          title: metadata.title,
          description: metadata.description || '',
          date: metadata.date || '',
          readTime: metadata.readTime || '',
          tags: Array.isArray(metadata.tags) ? metadata.tags : [],
          thumbnailBg: metadata.thumbnailBg || '#1f2937',
          thumbnailType: metadata.thumbnailType || 'code',
          thumbnailImage: resolvedImage,
          imageCaption: metadata.imageCaption || '',
          order: typeof metadata.order === 'number' ? metadata.order : 99,
        },
        content: content.trim(),
      });
    }
  }

  return posts.sort((a, b) => (a.metadata.order ?? 99) - (b.metadata.order ?? 99));
}

export function getProjectById(id: string): ProjectPost | undefined {
  const projects = getAllProjects();
  return projects.find((p) => p.metadata.id === id);
}

// Parse markdown list items into experience bullets with icon types
function parseBullets(markdownBody: string): ExperienceBullet[] {
  const bullets: ExperienceBullet[] = [];
  const lines = markdownBody.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      let rawText = trimmed.slice(2).trim();
      let iconType = 'chart'; // default

      // Match optional icon tag at start e.g. [chart], [chip], [rocket], etc.
      const iconMatch = rawText.match(/^\[([a-zA-Z0-9_-]+)\]\s*(.*)$/);
      if (iconMatch) {
        iconType = iconMatch[1].toLowerCase();
        rawText = iconMatch[2];
      }

      bullets.push({
        iconType,
        text: rawText,
      });
    }
  }

  return bullets;
}

export function getAllExperiences(): ExperienceItem[] {
  const items: ExperienceItem[] = [];

  for (const path in experienceModules) {
    const mod = experienceModules[path];
    const rawContent = typeof mod === 'string' ? mod : mod.default || '';
    const { metadata, content } = parseFrontmatter(rawContent);

    if (metadata.company || metadata.id) {
      items.push({
        metadata: {
          id: metadata.id || metadata.company?.toLowerCase().replace(/\s+/g, '-'),
          company: metadata.company || '',
          role: metadata.role || '',
          period: metadata.period || '',
          tag: metadata.tag || '',
          skills: Array.isArray(metadata.skills) ? metadata.skills : [],
          order: typeof metadata.order === 'number' ? metadata.order : 99,
        },
        bullets: parseBullets(content),
        rawMarkdown: content.trim(),
      });
    }
  }

  return items.sort((a, b) => (a.metadata.order ?? 99) - (b.metadata.order ?? 99));
}

export function getHomeContent(): HomeContent {
  for (const path in homeModules) {
    const mod = homeModules[path];
    const rawContent = typeof mod === 'string' ? mod : mod.default || '';
    const { metadata, content } = parseFrontmatter(rawContent);
    const rawAvatar = metadata.avatar || metadata.avatarImage || metadata.image || metadata.profilePicture;
    const resolvedAvatar = rawAvatar ? resolveAssetUrl(rawAvatar) : undefined;

    return {
      metadata: {
        ...metadata,
        avatar: resolvedAvatar,
      },
      content: content.trim(),
    };
  }
  return {
    metadata: {
      name: 'Tung Le',
      role: 'Software & Systems Engineer',
      subtitle: 'CS @ UMass Amherst',
    },
    content: 'Welcome to the lab log.',
  };
}

export function getSnippet(filename: string): string {
  for (const path in snippetModules) {
    if (path.endsWith(filename)) {
      const mod = snippetModules[path];
      const raw = typeof mod === 'string' ? mod : mod.default || '';
      return raw.trim();
    }
  }
  return '';
}
