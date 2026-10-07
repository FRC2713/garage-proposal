# Export the visible Option B geometry from frc2713_shop.skp as a JSON mesh,
# one bucket per material, in meters with Y up. Run it in SketchUp's Ruby
# console (or through the SketchUp MCP eval_ruby tool), then build the glTF:
#
#   node scripts/build-model.mjs option-b-mesh.json
require 'json'

OUT = File.expand_path("~/Desktop/option-b-mesh.json")
SKIP_TAGS = ["Roof", "Roof Structure", "Ceilings", "FTC Offseason", "Lab Labels"]
S = 0.0254 # inches to meters

m = Sketchup.active_model
g = m.entities.grep(Sketchup::Group).find { |e| e.name == "OPTION B" && e.bounds.depth > 100 }
buckets = {}
walk = lambda do |ents, tr, inh|
  ents.each do |e|
    next if e.hidden? || (e.respond_to?(:layer) && (SKIP_TAGS.include?(e.layer.name) || !e.layer.visible?))
    if e.is_a?(Sketchup::Face)
      mat = e.material || inh
      key = mat ? mat.name : "default"
      b = (buckets[key] ||= { "name" => key, "color" => mat ? [mat.color.red, mat.color.green, mat.color.blue] : [235, 235, 235],
                              "alpha" => mat ? mat.alpha : 1.0, "pos" => [], "nrm" => [] })
      mesh = e.mesh(4)
      mesh.polygons.each do |poly|
        poly.each do |idx|
          p = mesh.point_at(idx.abs).transform(tr)
          n = mesh.normal_at(idx.abs).transform(tr); n.normalize! if n.length > 0
          b["pos"].push((p.x * S).round(4), (p.z * S).round(4), (-p.y * S).round(4))
          b["nrm"].push(n.x.round(3), n.z.round(3), (-n.y).round(3))
        end
      end
    elsif e.respond_to?(:definition)
      name = e.name.empty? ? e.definition.name : e.name
      next if name =~ /^Label/
      walk.(e.definition.entities, tr * e.transformation, e.material || inh)
    end
  end
end
walk.(g.definition.entities, g.transformation, nil)
File.write(OUT, JSON.generate(buckets.values))
puts "Wrote #{OUT}"
