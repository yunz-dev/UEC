import os
import google.generativeai as genai

class Categoriser:
    def __init__(self):
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        model = genai.GenerativeModel('gemini-1.5-flash')
        self.chat = model.start_chat(history=[])
        
    def getOrCreateInstance():
        try:
            Categoriser._instance_
        except:
            Categoriser._instance_ = Categoriser()
        return Categoriser._instance_

    def categorise(summary_text):
        try:
            system_prompt = """You are an event categorizer. You will receive an event summary and must categorize it into any of these categories: {Unknown, Sport, Cultural, Academic, Networking, Gaming, Health}. An event can belong to multiple categories. If the summary given is empty or unable to be deciphered, you must categorise it as Unknown. If the category is Unknown, the event cannot belong to any other categories. Respond with only the categories, delimitted by a comma if it belongs to many. The following is the event summary to categorize:\n"""
            response = Categoriser.getOrCreateInstance().chat.send_message(str(system_prompt + summary_text), stream=False)
            return response.text.strip().split(", ")
        except:
            return []
  
# FOR TEST PURPOSES
from dotenv import load_dotenv

load_dotenv()

# if __name__ == "__main__":
#     Categoriser._instance_ = Categoriser()
#     summary_text = """Course Description:
# The Kung Fu Club is hosting a 5 week introduction to Kung Fu course, teaching the fundamentals of kung fu, using Long Fist as a basis of the course.
# Long Fist, also known as Changquan in Chinese, is a traditional style of Chinese martial arts (Kung Fu) characterized by its extended, fluid movements and emphasis on long-range techniques. It is one of the major forms of Chinese martial arts and is practiced both for self-defence and physical fitness.
# Here are some key characteristics and components of Long Fist Kung Fu that will be included within the Long Fist Kung Fu Course:
# – Long Range Techniques
# – Fluid Movements
# – Footwork
# – Kicking Techniques
# – Hand Techniques
# – Forms (Taolu)
# – Self-Defence Applications
# – Philosophical and Cultural Elements

# This course will be running on Monday nights. However, participants are welcome to attend Friday evening training sessions at the RMSH Dance Studio for additional training at no extra cost.

# Monday night training is held in the Theater Lounge in the UTS Underground.

# Friday night training is held at the RMSH Dance Studio.

# The course will run each Monday 6:30pm-7:30pm from the 17th of February 2025 through to the 17th of March 2025 (inclusive). Additionally, from 7:30pm-8pm after each class, participants are welcome to stay for further training on more advanced exploration of techniques and applications.
# """
#     print(Categoriser.categorise(summary_text))