
# CollegeWay

CollegeWay is a modern web application that simplifies the college application process by providing an intuitive platform for students to build, customize, and manage their college applications efficiently.

## Features

- **Smart Application Builder**: Create college applications with an intuitive, block-based interface
- **Authentication**: Secure user authentication powered by Clerk
- **Modern UI**: Sleek interface built with NextUI and Tailwind CSS
- **Full-Stack**: Next.js frontend with Flask backend for robust application processing
- **Export Functionality**: Export applications to standard document formats

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js, TypeScript |
| Styling | Tailwind CSS, NextUI |
| Authentication | Clerk |
| Backend | Flask |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/somwrks/CollegeWay.git
cd CollegeWay
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env.local
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

- `/app` - Next.js pages and routing
- `/components` - Reusable React components
- `/api` - Flask backend endpoints
- `/data` - Application data models and utilities

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

