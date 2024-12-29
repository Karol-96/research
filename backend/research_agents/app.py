from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import sys
from pathlib import Path

# Add the project root to Python path
ROOT_DIR = Path(__file__).parent.parent.parent.parent
sys.path.append(str(ROOT_DIR))

from market_agents.research_agents.research_agent_enhanced import WebSearchAgent
from market_agents.research_agents.utils import load_config, logger

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    query: str
    urls: Optional[List[str]] = None
    options: Optional[dict] = None

@app.post("/api/research")
async def research(request: ResearchRequest):
    try:
        # Load config and initialize agent
        config_data, prompts = load_config()
        
        if not config_data:
            raise HTTPException(
                status_code=500,
                detail="Failed to load configuration. Using default settings."
            )
        
        # Update config with request options if provided
        if request.options:
            config_data.update(request.options)
        
        agent = WebSearchAgent(config_data, prompts)
        
        # Process the search query
        await agent.process_search_query(request.query)
        
        # Return the results
        return {
            "status": "success",
            "results": [result.model_dump() for result in agent.results]
        }
        
    except Exception as e:
        logger.error(f"Research error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))