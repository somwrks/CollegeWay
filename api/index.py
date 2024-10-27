from flask import Flask, jsonify, request
from bs4 import BeautifulSoup
import requests
import openai
from datetime import datetime
import os
from supabase import create_client, Client
from cachetools import TTLCache
from typing import Dict, List

app = Flask(__name__)
supabase: Client = create_client(
    supabase_url='',
    supabase_key=''
)
openai.api_key= "sk-eA2xw9CMM8TFr09i6ebGNZgZufHvJjA7OGE2K1__SIT3BlbkFJCcg6Exgjj543ebbZWJmcUcB6ZRy3ePbZyOt08tRn0A"
# Common App essay prompts for 2024-2025
COMMON_APP_QUESTIONS = [
    {
        "id": 1,
        "question": "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.",
        "max_words": 650
    },
    {
        "id": 2,
        "question": "The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?",
        "max_words": 650
    },
    {
        "id": 3,
        "question": "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?",
        "max_words": 650
    },
    {
        "id": 4,
        "question": "Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?",
        "max_words": 650
    },
    {
        "id": 5,
        "question": "Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.",
        "max_words": 650
    },
    {
        "id": 6,
        "question": "Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?",
        "max_words": 650
    },
    {
        "id": 7,
        "question": "Share an essay on any topic of your choice. It can be one you've already written, one that responds to a different prompt, or one of your own design.",
        "max_words": 650
    }
]

UNIVERSITY_SPECIFIC_QUESTIONS = {
    "brown": [
        {
            "id": 1,
            "question": "What three words best describe you?",
            "max_words": 3
        },
        {
            "id": 2,
            "question": "What is your most meaningful extracurricular commitment, and what would you like us to know about it?",
            "max_words": 100
        },
        {
            "id": 3,
            "question": "If you could teach a class on any one thing, whether academic or otherwise, what would it be?",
            "max_words": 100
        },
        {
            "id": 4,
            "question": "In one sentence, Why Brown?",
            "max_words": 50
        }
    ],
    "dartmouth": [
        {
            "id": 1,
            "question": "As you seek admission to Class of 2029, what aspects of the college's academic program, community, and/or campus environment attract your interest? How is Dartmouth a good fit for you?",
            "max_words": 100
        }
    ],
    "duke": [
        {
            "id": 1,
            "question": "What is your sense of a university and a community, and why do you consider it a good match for you?",
            "max_words": 250
        }
    ]
}

SCHOLARSHIP_QUESTIONS = [
    {
        "id": 1,
        "question": "Describe how your leadership experience has shaped who you are today.",
        "max_words": 500
    },
    {
        "id": 2,
        "question": "What are your academic and career goals, and how will this scholarship help you achieve them?",
        "max_words": 500
    }
]

@app.route('/api/python/questions', methods=['GET'])
def get_application_questions():
    app_type = request.args.get('type', '')
    university = request.args.get('university', '').lower()
    
    if app_type == 'University':
        response_data = {
            "common_app": COMMON_APP_QUESTIONS
        }
        
        # Add university-specific questions if university is specified
        if university and university in UNIVERSITY_SPECIFIC_QUESTIONS:
            response_data["supplemental"] = UNIVERSITY_SPECIFIC_QUESTIONS[university]
        
        return jsonify(response_data)
    
    elif app_type == 'Scholarship':
        return jsonify({"questions": SCHOLARSHIP_QUESTIONS})
    
    else:
        return jsonify({"error": "Invalid application type"}), 400
university_cache = TTLCache(maxsize=100, ttl=3600)

@app.route('/api/python/scrape-university', methods=['GET'])
def scrape_university_data():
    university = request.args.get('university')
    if not university:
        return jsonify({"error": "University parameter is required"}), 400

    # Check cache first
    if university in university_cache:
        return jsonify(university_cache[university])

    try:
        # Initialize scraping session with headers
        session = requests.Session()
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        }

        # Format university name for search
        search_query = f"{university} university admissions requirements site:.edu"
        search_url = f"https://www.google.com/search?q={requests.utils.quote(search_query)}"

        # Get search results
        response = session.get(search_url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find first .edu link
        edu_links = [link.get('href') for link in soup.find_all('a') 
                    if 'href' in link.attrs and '.edu' in link.get('href')]
        
        if not edu_links:
            raise Exception("No university website found")

        # Scrape university page
        university_url = edu_links[0]
        university_response = session.get(university_url, headers=headers)
        university_soup = BeautifulSoup(university_response.text, 'html.parser')

        # Initialize data structure
        university_data = {
            "name": university,
            "admissions_criteria": [],
            "popular_majors": [],
            "application_tips": [],
            "requirements": []
        }

        # Extract GPA requirements
        gpa_patterns = ['GPA', 'Grade Point Average']
        for pattern in gpa_patterns:
            gpa_elements = university_soup.find_all(text=lambda text: pattern in text if text else False)
            for element in gpa_elements:
                text = element.strip()
                if any(char.isdigit() for char in text):
                    university_data["admissions_criteria"].append(text)

        # Extract SAT/ACT requirements
        test_patterns = ['SAT', 'ACT']
        for pattern in test_patterns:
            test_elements = university_soup.find_all(text=lambda text: pattern in text if text else False)
            for element in test_elements:
                text = element.strip()
                if any(char.isdigit() for char in text):
                    university_data["admissions_criteria"].append(text)

        # Extract majors
        major_keywords = ['major', 'program', 'degree']
        for keyword in major_keywords:
            major_elements = university_soup.find_all(['h2', 'h3', 'h4', 'p'], 
                text=lambda text: keyword in text.lower() if text else False)
            for element in major_elements:
                if len(element.text.strip()) > 5:  # Filter out too short texts
                    university_data["popular_majors"].append(element.text.strip())

        # Extract application tips
        tip_keywords = ['tip', 'advice', 'recommend', 'suggest']
        for keyword in tip_keywords:
            tip_elements = university_soup.find_all(['li', 'p'], 
                text=lambda text: keyword in text.lower() if text else False)
            for element in tip_elements:
                if len(element.text.strip()) > 10:  # Filter out too short texts
                    university_data["application_tips"].append(element.text.strip())

        # Extract requirements
        req_keywords = ['require', 'must', 'need']
        for keyword in req_keywords:
            req_elements = university_soup.find_all(['li', 'p'], 
                text=lambda text: keyword in text.lower() if text else False)
            for element in req_elements:
                if len(element.text.strip()) > 10:  # Filter out too short texts
                    university_data["requirements"].append(element.text.strip())

        # Remove duplicates and limit results
        for key in university_data:
            if isinstance(university_data[key], list):
                university_data[key] = list(dict.fromkeys(university_data[key]))[:10]

        # Add source URL
        university_cache[university] = university_data
        return jsonify(university_data)
    except Exception as e:
        print(f"Scraping error: {str(e)}")
        return jsonify({
            "error": "Failed to scrape university data",
            "details": str(e)
        }), 500
@app.route('/api/python/generate-answer', methods=['POST'])
def generate_answer():
    try:
        data = request.json
        if not data or 'question' not in data or 'user_profile' not in data:
            return jsonify({"error": "Missing required parameters"}), 400

        # Get user profile
        try:
            user_result = supabase.table('users').select('*').eq('userid', data['user_profile']['id']).execute()
            if not user_result.data or len(user_result.data) == 0:
                return jsonify({"error": "User profile not found"}), 404
            user_data = user_result.data[0]
        except Exception as db_error:
            print(f"Database error: {str(db_error)}")
            return jsonify({"error": "Failed to fetch user profile", "details": str(db_error)}), 500

        # Get university data if available
        university_data = None
        if data.get('university'):
            try:
                scrape_response = requests.get(
                    f"http://localhost:5328/api/python/scrape-university?university={data['university']}"
                )
                if scrape_response.status_code == 200:
                    university_data = scrape_response.json()
            except Exception as scrape_error:
                print(f"Error fetching university data: {str(scrape_error)}")

        # Construct enhanced prompt with university data
        prompt = f"""
        Student Profile:
        - Academic Background:
          • Grade Level: {user_data.get('grade', 'N/A')}
          • GPA: {user_data.get('gpa', 'N/A')}
          • Standardized Tests: {user_data.get('standardized_tests', 'N/A')}
          • Highest Coursework: {user_data.get('highest_coursework', 'N/A')}
          • Academic Awards: {user_data.get('academic_awards', 'N/A')}
        
        - Extracurricular Profile:
          • Activities: {user_data.get('extracurricular_activities', 'N/A')}
          • Community Service: {user_data.get('community_service', 'N/A')}
          • Hobbies: {user_data.get('hobbies', 'N/A')}
        
        - College Preferences:
          • Intended Majors: {user_data.get('intended_majors', 'N/A')}
          • Preferred College Type: {user_data.get('preferred_college_type', 'N/A')}
          • First Generation Student: {'Yes' if user_data.get('first_generation_student') else 'No'}
        """

        # Add university-specific information if available
        if university_data:
            prompt += f"""
            
        University Information for {university_data['name']}:
        - Admission Criteria:
          {chr(10).join([f"• {criterion}" for criterion in university_data['admissions_criteria']])}
        
        - Popular Majors:
          {chr(10).join([f"• {major}" for major in university_data['popular_majors']])}
        
        - Application Tips:
          {chr(10).join([f"• {tip}" for tip in university_data['application_tips']])}
        
        - Requirements:
          {chr(10).join([f"• {req}" for req in university_data['requirements']])}
        """

        prompt += f"""
        
        Application Question: {data['question']}

        Instructions for Response:
        1. Write a compelling response that aligns with the university's values and requirements
        2. Use specific examples from the student's background that match the university's criteria
        3. Reference relevant university-specific information when applicable
        4. Maintain a natural, conversational tone while being academically appropriate
        5. Address all aspects of the prompt thoroughly
        6. Stay within word limits while being detailed and specific
        7. Highlight experiences that align with the university's popular programs and requirements
        8. If the student is a first-generation student, incorporate that perspective thoughtfully
        9. Connect the student's experiences to their intended major and the university's offerings
        """

        # Generate response using OpenAI
        client = openai.Client(api_key=openai.api_key)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system", 
                    "content": "You are an experienced college application counselor who helps students write compelling, university-specific application essays."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500,
            temperature=0.85,
            presence_penalty=0.6,
            frequency_penalty=0.8
        )

        generated_answer = response.choices[0].message.content

        # Update application with new answer (same as before)
        try:
            current_app = supabase.table('applications').select('questions_answers').eq('applicationid', data.get('applicationId')).execute()
            if current_app.data and len(current_app.data) > 0:
                current_qa = current_app.data[0].get('questions_answers', {'questions': [], 'answers': []})
                
                supabase.table('applications').update({
                    'questions_answers': {
                        'questions': current_qa.get('questions', []) + [data['question']],
                        'answers': current_qa.get('answers', []) + [generated_answer]
                    }
                }).eq('applicationid', data.get('applicationId')).execute()
        except Exception as update_error:
            print(f"Error updating application: {str(update_error)}")

        return jsonify({
            "answer": generated_answer,
            "timestamp": datetime.now().isoformat(),
            "status": "success"
        })

    except Exception as e:
        print(f"Error generating answer: {str(e)}")
        return jsonify({
            "error": "Failed to generate answer",
            "details": str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5328)
    
    
#  fetch common app questions an pass it to frontend for answering

# fetch scholarship application form questions and pass it to frontend for answering

# scrape through university websites, articles and accepted student's application from previous admissions along wiht user's profile to develop context for the llm then ask specific questions requested as part of the application that the user is trying to fill out.  

# ai api with small prompts for that it is a counsellor bot with some knowledge about user's info