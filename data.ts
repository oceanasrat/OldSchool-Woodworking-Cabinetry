import site from '../../data/site.json'
import projects from '../../data/projects.json'
import testimonials from '../../data/testimonials.json'
import blog from '../../data/blog.json'

export type Site = typeof site
export type Project = typeof projects[number]
export type Testimonial = typeof testimonials[number]
export type BlogPost = typeof blog[number]

export function useData(){
  return { site, projects, testimonials, blog }
}
