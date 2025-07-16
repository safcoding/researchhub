import { getUpcomingConferences } from "../server/fetchConferences"
import { ConferenceContent } from "./conference"

const UpcomingConferences = async () => {
  const conferences = await getUpcomingConferences(3)
  
  return <ConferenceContent conferences={conferences} />
}

export { UpcomingConferences }