from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import asyncio
from datetime import datetime

class ResearchRequest(BaseModel):
    query: str
    urls: Optional[List[str]] = None

@app.post("/api/research")
async def perform_research(request: ResearchRequest):
    try:
        # Load configuration
        config_data, prompts = load_config()
        
        # Override config values from the request
        config_data["query"] = request.query
        config_data["urls"] = request.urls if request.urls else []
        
        # Initialize configuration and agent
        config = WebSearchConfig(**config_data)
        agent = WebSearchAgent(config, prompts)
        
        # Perform the search
        results = await agent.process_search_query(request.query)
        
        # Format results to match frontend expectations
        formatted_results = []
        for result in results:
            if result.status == "success":
                formatted_results.append({
                    "url": result.url,
                    "title": result.title,
                    "content": result.content,
                    "timestamp": datetime.now().isoformat(),
                    "status": result.status,
                    "summary": result.summary,
                    "agent_id": result.agent_id,
                    "extraction_method": "web_search"
                })
        
        return formatted_results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))