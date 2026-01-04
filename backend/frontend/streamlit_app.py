import streamlit as st
import requests
import os
from dotenv import load_dotenv

load_dotenv()
BACKEND = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")

st.set_page_config(page_title="HR Chatbot", page_icon="🤖")
st.title("🤖 HR Resource & Employee Query Chatbot")

if "messages" not in st.session_state:
    st.session_state.messages = []

# display
for m in st.session_state.messages:
    if m["role"] == "user":
        st.markdown(f"**You:** {m['content']}")
    else:
        st.markdown(f"**Bot:** {m['content']}")
        if "sources" in m:
            st.markdown("**Sources:**")
            for s in m["sources"]:
                st.markdown(f"- {s}")

query = st.text_input("Ask about HR policies or find employees (e.g. 'Find Python developers with 3+ years')")

if st.button("Send") and query:
    st.session_state.messages.append({"role":"user","content":query})
    with st.spinner("Thinking..."):
        try:
            resp = requests.post(f"{BACKEND}/chat", json={"query": query}, timeout=30)
            if resp.status_code==200:
                j = resp.json()
                ans = j.get("answer","")
                sources = j.get("sources",[])
            else:
                ans = f"Error: {resp.status_code} {resp.text}"
                sources = []
        except Exception as e:
            ans = f"Connection error: {e}"
            sources = []
    st.session_state.messages.append({"role":"assistant","content":ans,"sources":sources})
    st.experimental_rerun()
